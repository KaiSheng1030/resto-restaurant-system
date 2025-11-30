import React, { useEffect, useState } from "react";
import {
  getBookings,
  cancelBooking,
  updateBooking,
  getTables,
  addTable,
  deleteTable,
} from "../api";

import ConfirmDialog from "./ConfirmDialog";
import EditDialog from "./EditDialog";
import Toast from "./Toast";

import Charts from "./Charts";
import CustomerHome from "./customer/CustomerHome";
import CustomerTablePage from "./customer/CustomerTablePage";
import CustomerReserve from "./customer/CustomerReserve";

export default function Owner({ lang = "en" }) {
  /* ===============================
        ROLE
  =============================== */
  const role = localStorage.getItem("role") || "customer";
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
      edit: "Edit",
      cancel: "Cancel",
      cancelReservation: "Cancel reservation for",
      seats: "seats",
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
      edit: "编辑",
      cancel: "取消",
      cancelReservation: "取消预订",
      seats: "个座位",
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
    if (!newTableNum || !newTableCapacity) return;

    try {
      await addTable(Number(newTableNum), Number(newTableCapacity));
      loadTables();
      setNewTableNum("");
      setNewTableCapacity("");
    } catch {}
  };

  /* ===============================
        DELETE TABLE
  =============================== */
  const handleDeleteTable = async (id) => {
    try {
      await deleteTable(id);
      loadTables();
    } catch {}
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

                    <button
                      className="pill-btn btn-cancel"
                      onClick={() => handleDeleteTable(id)}
                    >
                      {t[lang].delete}
                    </button>
                  </div>
                );
              })}

              <h4>{t[lang].addTable}</h4>
              <div style={{ display: "flex", gap: 10 }}>
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
                <button className="pill-btn btn-edit" onClick={handleAddTable}>
                  {t[lang].add}
                </button>
              </div>
            </div>

            <Charts bookings={bookings} lang={lang} />

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
                </div>

                <div className="booking-actions">
                  <button
                    className="pill-btn btn-edit"
                    onClick={() => setEditData(b.id)}
                  >
                    {t[lang].edit}
                  </button>

                  <button
                    className="pill-btn btn-cancel"
                    onClick={() =>
                      setConfirmData({ bookingId: b.id, name: b.name })
                    }
                  >
                    {t[lang].cancel}
                  </button>
                </div>

                {editData === b.id && (
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
                )}

                {confirmData?.bookingId === b.id && (
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
                )}
              </div>
            ))}
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
            <h3 style={{ marginTop: 40 }}>{t[lang].customerLiveView}</h3>
          </>
        )}

        {/* LIVE VIEW */}
        <div className="card customer-live-card">
          <div className="customer-live-inner">
            {custPage === "home" && (
              <CustomerHome
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
      </div>
    </>
  );
}
