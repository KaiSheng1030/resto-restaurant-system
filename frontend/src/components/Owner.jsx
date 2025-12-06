import React, { useEffect, useState } from "react";
import {
  getBookings,
  cancelBooking,
  updateBooking,
  getTables,
  addTable,
  deleteTable,
  getFloorPlanLayout,
  saveFloorPlanLayout,
} from "../api";

import ConfirmDialog from "./ConfirmDialog";
import EditDialog from "./EditDialog";
import Toast from "./Toast";
import FloorPlan from "./FloorPlan";
import FloorPlanEditor from "./FloorPlanEditor";

import Charts from "./Charts";
import CustomerHome from "./customer/CustomerHome";
import CustomerTablePage from "./customer/CustomerTablePage";
import CustomerReserve from "./customer/CustomerReserve";
import "./TablesManager.css";

export default function Owner({ lang = "en", userRole }) {
  /* ===============================
    ROLE
  =============================== */
  const role = userRole || "customer";
  const isCustomer = role === "customer";
  const isAdmin = role === "admin";
  const isOwner = role === "owner";

  /* ===============================
        TRANSLATION
  =============================== */
  const t = {
    en: {
      ownerPanel: "Owner Panel",
      adminPanel: "Admin Panel",
      customerView: "Customer Reservation View",
      todayBookings: "Today's Bookings",
      totalCustomers: "Total Customers",
      tablesAvailable: "Tables Available",
      tableManager: "Table Manager",
      delete: "Delete",
      addTable: "Add Table",
      tableNumber: "Table Number",
      capacity: "Capacity (seats)",
      add: "Add",
      customerLiveView: "Customer Live Table View",
      allReservations: "All Reservations",
      noReservations: "No reservations yet.",
      people: "people",
      table: "Table",
      noPhone: "No phone",
      noDate: "No date",
      edit: "Edit",
      cancel: "Cancel",
      cancelReservation: "Cancel reservation for",
      seats: "seats",
      editLayout: "Edit Floor Plan Layout",
    },
    zh: {
      ownerPanel: "业主面板",
      adminPanel: "管理员面板",
      customerView: "顾客预订视图",
      todayBookings: "今日预订",
      totalCustomers: "总客人数",
      tablesAvailable: "可用餐桌",
      tableManager: "餐桌管理",
      delete: "删除",
      addTable: "添加餐桌",
      tableNumber: "餐桌编号",
      capacity: "容量（座位）",
      add: "添加",
      customerLiveView: "客户实时餐桌视图",
      allReservations: "所有预订",
      noReservations: "暂无预订。",
      people: "人",
      table: "餐桌",
      noPhone: "无电话",
      noDate: "无日期",
      edit: "编辑",
      cancel: "取消",
      cancelReservation: "取消预订",
      seats: "个座位",
      editLayout: "编辑平面图布局",
    },
  };

  /* ===============================
        STATES
  =============================== */
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  const [newTableNum, setNewTableNum] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("");
  const [confirmData, setConfirmData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [floorPlanKey, setFloorPlanKey] = useState(0);

  /* ===============================
        LOAD DATA
  =============================== */
  const loadTables = async () => {
    try {
      const res = await getTables();
      setTables(res.data || []);
    } catch {
      setTables([]);
    }
  };

  const loadBookings = async () => {
    if (isCustomer) return;
    try {
      const res = await getBookings();
      setBookings(res.data || []);
    } catch {}
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadTables();
    loadBookings();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* ===============================
        DASHBOARD NUMBERS
  =============================== */
  const today = bookings.length;
  const customers = bookings.reduce((s, b) => s + Number(b.people), 0);

  /* ===============================
        CUSTOMER PAGE
  =============================== */
  const [custPage, setCustPage] = useState("home");
  const [custSelectedTable, setCustSelectedTable] = useState(null);

  const handleCustomerSetPage = (page) => {
    if (page === "customer") setCustPage("home");
    if (page === "customer-table") setCustPage("table");
    if (page === "customer-reserve") setCustPage("reserve");
  };

  /* ===============================
        ADD TABLE
  =============================== */
  const handleAddTable = async () => {
    if (!newTableNum.trim()) {
      const msg = lang === 'en' ? "❌ Please fill in table number" : "❌ 请填写餐桌编号";
      setToast(msg);
      return;
    }
    
    if (!newTableCapacity.trim()) {
      setToast(lang === 'en' ? "❌ Please fill in table capacity" : "❌ 请填写餐桌容量");
      return;
    }

    // Check if table number already exists
    const tableNum = Number(newTableNum);
    const tableExists = tables.some(tbl => {
      const tableId = typeof tbl === 'object' ? tbl.id : tbl;
      return tableId === tableNum;
    });

    if (tableExists) {
      setToast(lang === 'en' ? "❌ Table number already exists" : "❌ 餐桌编号已存在");
      return;
    }

    try {
      await addTable(tableNum, Number(newTableCapacity));
      setNewTableNum("");
      setNewTableCapacity("");
      await loadTables();
      
      // Add default position for new table to backend
      await addDefaultPositionForNewTable(tableNum, Number(newTableCapacity));
      
      setFloorPlanKey(prev => prev + 1);
      setToast(lang === 'en' ? "✅ Table added successfully!" : "✅ 餐桌添加成功！");
    } catch (err) {
      const errorMsg = err.response?.data?.error || (lang === 'en' ? "Failed to add table" : "添加餐桌失败");
      setToast(`❌ ${errorMsg}`);
    }
  };

  /* ===============================
        DELETE TABLE
  =============================== */
  const handleDeleteTable = async (id) => {
    try {
      await deleteTable(id);
      await loadTables();
      
      // Remove table position from backend
      await removeTablePositionFromBackend(id);
      
      setFloorPlanKey(prev => prev + 1);
      const msg = lang === 'en' ? `✅ Table ${id} deleted successfully!` : `✅ 餐桌 ${id} 已成功删除！`;
      setToast(msg);
    } catch {
      const msg = lang === 'en' ? `❌ Failed to delete table ${id}` : `❌ 删除餐桌 ${id} 失败`;
      setToast(msg);
    }
  };

  /* ===============================
        HELPER: Add default position for new table
  =============================== */
  const addDefaultPositionForNewTable = async (tableId, capacity) => {
    try {
      const res = await getFloorPlanLayout();
      const currentLayout = res.data || {};
      
      // Calculate default position
      const positions = {
        1: { top: "20%", left: "10%" },
        2: { top: "42%", left: "10%" },
        3: { top: "20%", left: "28%" },
        4: { top: "20%", left: "46%" },
        5: { top: "22%", left: "68%" },
        6: { top: "50%", left: "28%" },
        7: { top: "50%", left: "46%" },
        8: { top: "16%", left: "87%" },
        9: { top: "32%", left: "87%" },
        10: { top: "75%", left: "30%" },
        11: { top: "50%", left: "68%" },
        12: { top: "75%", left: "53%" },
        13: { top: "75%", left: "72%" },
      };
      
      const defaultPos = positions[tableId] || {
        top: `${85 + Math.floor((tableId - 14) / 3) * 12}%`,
        left: `${15 + ((tableId - 14) % 3) * 30}%`,
      };
      
      // Add new table position to layout
      const updatedLayout = {
        ...currentLayout,
        tables: {
          ...(currentLayout.tables || {}),
          [tableId]: defaultPos
        }
      };
      
      await saveFloorPlanLayout(updatedLayout);
    } catch (err) {
      console.error("Failed to save default position for new table:", err);
    }
  };

  /* ===============================
        HELPER: Remove table position from backend
  =============================== */
  const removeTablePositionFromBackend = async (tableId) => {
    try {
      const res = await getFloorPlanLayout();
      const currentLayout = res.data || {};
      
      if (currentLayout.tables && currentLayout.tables[tableId]) {
        const { [tableId]: removed, ...remainingTables } = currentLayout.tables;
        
        const updatedLayout = {
          ...currentLayout,
          tables: remainingTables
        };
        
        await saveFloorPlanLayout(updatedLayout);
      }
    } catch (err) {
      console.error("Failed to remove table position:", err);
    }
  };

  return (
    <>
      {toast && <Toast message={toast} close={() => setToast("")} />}

      <div className="owner-page fade-in">
        <h2>
          {isOwner
            ? t[lang].ownerPanel
            : isAdmin
            ? t[lang].adminPanel
            : t[lang].customerView}
        </h2>

        {/* OWNER FULL PANEL */}
        {isOwner && (
          <>
            <div className="dashboard-grid" style={{ marginBottom: 20 }}>
              <div className="dash-card">
                <div className="dash-title">{t[lang].todayBookings}</div>
                <div className="dash-num">{today}</div>
              </div>
              <div className="dash-card">
                <div className="dash-title">{t[lang].totalCustomers}</div>
                <div className="dash-num">{customers}</div>
              </div>
              <div className="dash-card">
                <div className="dash-title">{t[lang].tablesAvailable}</div>
                <div className="dash-num">{tables.length}</div>
              </div>
            </div>

            <div className="table-manager">
              <h3 className="tm-title">{t[lang].tableManager}</h3>
              
              <div className="tm-list">
                {tables.map((tbl) => {
                  const id = typeof tbl === "object" ? tbl.id : tbl;
                  const cap = typeof tbl === "object" ? tbl.capacity : "N/A";

                  return (
                    <div key={id} className="tm-row">
                      <span className="tm-table-info">
                        {t[lang].table} {id} ({cap} {t[lang].seats})
                      </span>
                      <button
                        className="tm-delete"
                        onClick={() => handleDeleteTable(id)}
                      >
                        {t[lang].delete}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="tm-add-box">
                <input
                  type="number"
                  placeholder={t[lang].tableNumber}
                  value={newTableNum}
                  onChange={(e) => setNewTableNum(e.target.value)}
                />
                <input
                  type="number"
                  placeholder={t[lang].capacity}
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                />
                <button className="tm-add" onClick={handleAddTable}>
                  {t[lang].add}
                </button>
              </div>
            </div>

            <Charts bookings={bookings} tables={tables} lang={lang} />

            <h3 style={{ marginTop: 40 }}>{t[lang].allReservations}</h3>

            {bookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-info">
                  <span className="booking-name">{b.name}</span>
                  <span className="booking-meta">
                    {b.people} {t[lang].people} • {t[lang].table} {b.table}
                  </span>
                  <span className="booking-meta">{b.time}</span>
                  <span className="booking-meta">
                    📞 {b.phone || t[lang].noPhone}
                  </span>
                  <span className="booking-meta">
                    📅 {b.date || t[lang].noDate}
                  </span>
                </div>

                <div className="booking-actions">
                  <button
                    className="mini-btn"
                    onClick={() => setEditData(b.id)}
                  >
                    {t[lang].edit}
                  </button>

                  <button
                    className="danger-btn"
                    onClick={() =>
                      setConfirmData({ bookingId: b.id, name: b.name })
                    }
                  >
                    {t[lang].cancel}
                  </button>

                  {/* Render dialogs as siblings to buttons */}
                  {editData === b.id && (
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <EditDialog
                        data={b}
                        onCancel={() => setEditData(null)}
                        onSave={async (u) => {
                          await updateBooking(b.id, u);
                          setEditData(null);
                          loadBookings();
                        }}
                        lang={lang}
                      />
                    </div>
                  )}

                  {confirmData?.bookingId === b.id && (
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <ConfirmDialog
                        message={`${t[lang].cancelReservation} ${b.name}?`}
                        onCancel={() => setConfirmData(null)}
                        onConfirm={async () => {
                          await cancelBooking(b.id);
                          setConfirmData(null);
                          loadBookings();
                        }}
                        lang={lang}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Edit Floor Plan Button */}
            <div style={{ marginTop: '60px', marginBottom: '-60px', marginLeft: '60px' }}>
              {isOwner && (
                <button
                  className="pill-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '14px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    position: 'relative',
                    zIndex: 200
                  }}
                  onClick={() => {
                    setShowEditor(true);
                    // Scroll to center of page smoothly when opening editor
                    setTimeout(() => {
                      const scrollHeight = document.documentElement.scrollHeight;
                      const windowHeight = window.innerHeight;
                      const centerPosition = (scrollHeight - windowHeight) / 2;
                      window.scrollTo({ top: centerPosition, behavior: 'smooth' });
                    }, 50);
                  }}
                >
                  🎨 {t[lang].editLayout}
                </button>
              )}
            </div>
          </>
        )}

        {/* ADMIN VIEW */}
        {isAdmin && !isOwner && (
          <>
            <div className="dashboard-grid" style={{ marginBottom: 20 }}>
              <div className="dash-card">
                <div className="dash-title">{t[lang].todayBookings}</div>
                <div className="dash-num">{today}</div>
              </div>
              <div className="dash-card">
                <div className="dash-title">{t[lang].totalCustomers}</div>
                <div className="dash-num">{customers}</div>
              </div>
              <div className="dash-card">
                <div className="dash-title">{t[lang].tablesAvailable}</div>
                <div className="dash-num">{tables.length}</div>
              </div>
            </div>

            <h3>{t[lang].tableManager}</h3>

            <div className="card" style={{ padding: 20 }}>
              {tables.map((tbl) => {
                const id = typeof tbl === "object" ? tbl.id : tbl;
                const cap = typeof tbl === "object" ? tbl.capacity : "N/A";

                return (
                  <div key={id} className="table-list-item">
                    <span>
                      {t[lang].table} {id} ({cap} {t[lang].seats})
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CUSTOMER VIEW */}
        {isCustomer && (
          <>
            <h3 style={{ marginTop: 16 }}>{t[lang].customerLiveView}</h3>
          </>
        )}

        {/* LIVE VIEW */}
        <div className="customer-live-inner">
          {custPage === "home" && (
            <CustomerHome
              key={floorPlanKey}
              setPage={handleCustomerSetPage}
              setSelectedTable={setCustSelectedTable}
              lang={lang}
            />
          )}
          {custPage === "table" && (
            <CustomerTablePage
              tableId={custSelectedTable}
              setPage={handleCustomerSetPage}
              lang={lang}
            />
          )}
          {custPage === "reserve" && (
            <CustomerReserve
              selectedTable={custSelectedTable}
              setPage={handleCustomerSetPage}
              setToast={setToast}
              lang={lang}
            />
          )}
        </div>
      </div>

      {/* Floor Plan Editor Modal */}
      {showEditor && (
        <FloorPlanEditor
          key={floorPlanKey}
          tables={tables}
          onClose={(needsRefresh) => {
            setShowEditor(false);
            // Force re-render of FloorPlan component by updating key
            if (needsRefresh) {
              loadTables();
              setFloorPlanKey(prev => prev + 1); // Force CustomerHome to reload floor plan
            }
          }}
          lang={lang}
        />
      )}
    </>
  );
}
