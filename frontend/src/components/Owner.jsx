import React, { useEffect, useState } from "react";
import { getBookings, cancelBooking } from "../api";
import ConfirmDialog from "./ConfirmDialog";

export default function Owner() {
  const [bookings, setBookings] = useState([]);

  // ⭐ TABLES FROM LOCAL STORAGE
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem("tables");
    return saved ? JSON.parse(saved) : [1, 2, 3, 4, 5];
  });

  const [newTable, setNewTable] = useState("");

  // ⭐ CONFIRM DIALOG
  const [confirmData, setConfirmData] = useState(null);

  // Save tables to localStorage
  useEffect(() => {
    localStorage.setItem("tables", JSON.stringify(tables));
  }, [tables]);

  const addTable = () => {
    const num = Number(newTable);

    if (!num) return alert("Invalid table number");
    if (tables.includes(num)) return alert("Table already exists");

    const updated = [...tables, num].sort((a, b) => a - b);
    setTables(updated);
    setNewTable("");
  };

  const deleteTable = (id) => {
    if (window.confirm("Delete this table?")) {
      setTables(tables.filter((t) => t !== id));
    }
  };

  const load = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data || []);
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  const today = bookings.length;
  const customers = bookings.reduce((s, b) => s + Number(b.people), 0);

  return (
    <div className="fade-in">
      <h2>Owner Panel Overview</h2>

      {/* Stats */}
      <div className="dashboard-grid" style={{ marginBottom: "20px" }}>
        <div className="dash-card">
          <div className="dash-title">Today's Bookings</div>
          <div className="dash-num">{today}</div>
        </div>

        <div className="dash-card">
          <div className="dash-title">Total Customers</div>
          <div className="dash-num">{customers}</div>
        </div>

        <div className="dash-card">
          <div className="dash-title">Tables Available</div>
          <div className="dash-num">{tables.length}</div>
        </div>
      </div>

      {/* Table Manager */}
      <div className="card table-manager-card">
        <div className="tm-header">
          <h3>Table Manager</h3>
          <span className="tm-count">{tables.length} tables</span>
        </div>

        <div className="tm-list">
          {tables.map((t) => (
            <div key={t} className="tm-row">
              <span className="tm-label">Table {t}</span>
              <button className="tm-delete" onClick={() => deleteTable(t)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="tm-add">
          <input
            type="number"
            placeholder="Enter new table number"
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            className="tm-input"
          />
          <button className="tm-add-btn" onClick={addTable}>
            Add
          </button>
        </div>
      </div>

      {/* Reservations */}
      <h3 style={{ marginTop: "25px" }}>All Reservations</h3>

      {bookings.length === 0 && <p className="empty">No reservations yet.</p>}

      {bookings.map((b) => (
        <div className="booking-card" key={b.id}>
          <div className="booking-info">
            <span className="booking-name">{b.name}</span>
            <span className="booking-meta">
              {b.people} people • Table {b.table}
            </span>
            <span className="booking-meta">{b.time}</span>
          </div>

          <button
            className="danger-btn"
            onClick={() =>
              setConfirmData({
                bookingId: b.id,
                name: b.name,
              })
            }
          >
            Cancel
          </button>
        </div>
      ))}

      {/* Confirm Dialog */}
      {confirmData && (
        <ConfirmDialog
          message={`Cancel reservation for ${confirmData.name}?`}
          onCancel={() => setConfirmData(null)}
          onConfirm={async () => {
            await cancelBooking(confirmData.bookingId);
            setConfirmData(null);
            load();
          }}
        />
      )}
    </div>
  );
}
