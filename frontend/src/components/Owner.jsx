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

export default function Owner({ lang = 'en' }) {
  const t = {
    en: {
      title: "Owner Panel Overview",
      todayBookings: "Today's Bookings",
      totalCustomers: "Total Customers",
      tablesAvailable: "Tables Available",
      tableManager: "Table Manager",
      delete: "Delete",
      addTable: "Add Table",
      tableNumber: "Table number",
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
      tableAdded: "Table added successfully.",
      failedAddTable: "Failed to add table.",
      tableDeleted: "Table deleted.",
      failedDeleteTable: "Failed to delete table.",
      reservationUpdated: "Reservation updated.",
      reservationCancelled: "Reservation cancelled.",
      cancelReservation: "Cancel reservation for",
      seats: "seats"
    },
    zh: {
      title: "业主面板概览",
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
      tableAdded: "餐桌添加成功。",
      failedAddTable: "添加餐桌失败。",
      tableDeleted: "餐桌已删除。",
      failedDeleteTable: "删除餐桌失败。",
      reservationUpdated: "预订已更新。",
      reservationCancelled: "预订已取消。",
      cancelReservation: "取消预订",
      seats: "个座位"
    }
  };

  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);

  const [newTableNum, setNewTableNum] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("");
  const [confirmData, setConfirmData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState("");

  /* ===============================
      LOAD TABLES (BACKEND + SYNC)
  =============================== */
  const loadTables = async () => {
    try {
      const res = await getTables();
      const list = res.data || [];

      setTables(list);
      localStorage.setItem("tables", JSON.stringify(list)); // ⭐ Sync to Customer
    } catch {
      setTables([1, 2, 3, 4, 5]);
    }
  };

  /* ===============================
      LOAD BOOKINGS
  =============================== */
  const loadBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data || []);
    } catch {}
  };

  useEffect(() => {
    loadTables();
    loadBookings();
  }, []);

  /* ===============================
      DASHBOARD NUMBERS
  =============================== */
  const today = bookings.length;
  const customers = bookings.reduce((s, b) => s + Number(b.people), 0);

  const [custPage, setCustPage] = useState("home");
  const [custSelectedTable, setCustSelectedTable] = useState(null);

  /* ⭐ IMPORTANT FIX — correct page mapping */
  const handleCustomerSetPage = (page) => {
    if (page === "customer") setCustPage("home");
    else if (page === "customer-table") setCustPage("table");
    else if (page === "customer-reserve") setCustPage("reserve");
    else setCustPage("home");
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
      setTimeout(() => setToast(""), 3000);
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
      setTimeout(() => setToast(""), 3000);
      return;
    }

    try {
      await addTable(tableNum, Number(newTableCapacity));
      setNewTableNum("");
      setNewTableCapacity("");
      loadTables();
      setToast(lang === 'en' ? "✅ Table added successfully!" : "✅ 餐桌添加成功！");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || (lang === 'en' ? "Failed to add table" : "添加餐桌失败");
      setToast(`❌ ${errorMsg}`);
      setTimeout(() => setToast(""), 3000);
    }
  };

  /* ===============================
      DELETE TABLE
  =============================== */
  const handleDeleteTable = async (num) => {
    try {
      await deleteTable(num);
      loadTables();
      const msg = lang === 'en' ? `✅ Table ${num} deleted successfully!` : `✅ 餐桌 ${num} 已成功删除！`;
      setToast(msg);
    } catch {
      const msg = lang === 'en' ? `❌ Failed to delete table ${num}` : `❌ 删除餐桌 ${num} 失败`;
      setToast(msg);
    }
  };

  return (
    <>
      {/* TOAST - Fixed to screen */}
      {toast && <Toast message={toast} close={() => setToast("")} />}

      <div className="fade-in owner-page">
        <h2>{t[lang].title}</h2>

      {/* DASHBOARD */}
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

      {/* TABLE MANAGER */}
      <h3>{t[lang].tableManager}</h3>
      <div className="card" style={{ padding: 20, marginBottom: 30 }}>
        {/* TABLE LIST */}
        <div style={{ marginBottom: 15 }}>
          {(tables || []).map((tbl) => {
            const tableId = typeof tbl === 'object' ? tbl.id : tbl;
            const capacity = typeof tbl === 'object' ? tbl.capacity : 4;
            return (
              <div
                key={tableId}
                className="table-list-item"
              >
                <span>{t[lang].table} {tableId} ({capacity} {t[lang].seats})</span>
                <button
                  className="pill-btn btn-cancel"
                  style={{ padding: "6px 16px" }}
                  onClick={() => handleDeleteTable(tableId)}
                >
                  {t[lang].delete}
                </button>
              </div>
            );
          })}
        </div>

        {/* ADD TABLE */}
        <h4>{t[lang].addTable}</h4>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="number"
            placeholder={t[lang].tableNumber}
            value={newTableNum}
            onChange={(e) => setNewTableNum(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
          <input
            type="number"
            placeholder={t[lang].capacity}
            value={newTableCapacity}
            onChange={(e) => setNewTableCapacity(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
          <button
            className="pill-btn btn-edit"
            onClick={handleAddTable}
            style={{ padding: "8px 18px" }}
          >
            {t[lang].add}
          </button>
        </div>
      </div>

      {/* CHARTS */}
      <Charts bookings={bookings} lang={lang} />

      {/* CUSTOMER LIVE TABLE VIEW */}
      <h3 style={{ marginTop: 40 }}>{t[lang].customerLiveView}</h3>
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

      {/* ALL BOOKINGS */}
      <h3 style={{ marginTop: 40 }}>{t[lang].allReservations}</h3>

      {bookings.length === 0 && <p className="empty">{t[lang].noReservations}</p>}

      {(bookings || []).map((b) => (
        <div className="booking-card" key={b.id} style={{ position: "relative" }}>
          <div className="booking-info">
            <span className="booking-name">{b.name}</span>
            <span className="booking-meta">
              {b.people} {t[lang].people} • {t[lang].table} {b.table}
            </span>
            <span className="booking-meta">{b.time}</span>
            <span className="booking-meta">
              📞 {b.phone?.trim() ? b.phone : t[lang].noPhone}
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
              onClick={() => setConfirmData({ bookingId: b.id, name: b.name })}
            >
              {t[lang].cancel}
            </button>
          </div>

          {/* EDIT POPUP */}
          {editData === b.id && (
            <EditDialog
              data={b}
              onCancel={() => setEditData(null)}
              onSave={async (updated) => {
                await updateBooking(b.id, updated);
                setEditData(null);
                loadBookings();
                setToast(t[lang].reservationUpdated);
              }}
              lang={lang}
            />
          )}

          {/* CONFIRM DELETE */}
          {confirmData?.bookingId === b.id && (
            <ConfirmDialog
              message={`${t[lang].cancelReservation} ${b.name}?`}
              onCancel={() => setConfirmData(null)}
              onConfirm={async () => {
                await cancelBooking(b.id);
                setConfirmData(null);
                loadBookings();
                setToast(t[lang].reservationCancelled);
              }}
              lang={lang}
            />
          )}
        </div>
      ))}
      </div>
    </>
  );
}
