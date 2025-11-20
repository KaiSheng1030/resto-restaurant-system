import React, { useEffect, useState } from "react";
import { getBookings, cancelBooking } from "../api";

export default function Owner() {
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    load();
  }, []);

  const today = bookings.length;
  const customers = bookings.reduce((s, b) => s + Number(b.people), 0);

  return (
    <div className="fade-in">
      <h2>Owner Panel Overview</h2>

      {/* SUMMARY CARDS */}
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
          <div className="dash-title">Tables Used</div>
          <div className="dash-num">
            {bookings.filter((b) => b.table).length}
          </div>
        </div>
      </div>

      {/* RESERVATIONS LIST */}
      <h3>All Reservations</h3>

      {bookings.length === 0 && (
        <p className="empty">No reservations yet.</p>
      )}

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
            onClick={async () => {
              await cancelBooking(b.id);
              load();
            }}
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
