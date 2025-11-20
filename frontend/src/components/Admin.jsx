import React, { useEffect, useState } from "react";
import { getBookings, cancelBooking, updateBooking } from "../api";
import ConfirmDialog from "./ConfirmDialog";
import EditDialog from "./EditDialog";

export default function Admin({ setToast }) {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [editData, setEditData] = useState(null);

  // Load bookings
  const load = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch (err) {
      console.log("Error loading bookings", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Search filter
  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      String(b.table).includes(q) ||
      b.time.toLowerCase().includes(q)
    );
  });

  // Cancel booking
  const handleCancel = async (id) => {
    await cancelBooking(id);
    setToast("Booking canceled!");
    load();
  };

  return (
    <div className="fade-in">
      <h2>Reservation List</h2>

      {/* Search bar (beautiful version) */}
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search bookings..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="empty">No matching reservations.</p>
      )}

      {/* Booking list */}
      {filtered.map((b) => (
        <div className="booking-card" key={b.id}>
          <div className="booking-info">
            <span className="booking-name">{b.name}</span>
            <span className="booking-meta">
              {b.people} people • Table {b.table}
            </span>
            <span className="booking-meta">{b.time}</span>
          </div>

          <div className="booking-actions">
            <button className="mini-btn" onClick={() => setEditData(b)}>
              Edit
            </button>

            <button className="danger-btn" onClick={() => setConfirmId(b.id)}>
              Cancel
            </button>
          </div>
        </div>
      ))}

      {/* Confirm delete dialog */}
      {confirmId && (
        <ConfirmDialog
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            handleCancel(confirmId);
            setConfirmId(null);
          }}
        />
      )}

      {/* Edit booking dialog */}
      {editData && (
        <EditDialog
          data={editData}
          onCancel={() => setEditData(null)}
          onSave={async (newData) => {
            await updateBooking(editData.id, newData);
            setToast("Booking updated!");
            setEditData(null);
            load();
          }}
        />
      )}
    </div>
  );
}
