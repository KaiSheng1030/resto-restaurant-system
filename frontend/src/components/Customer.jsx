import React, { useState, useEffect } from "react";
import { getBookings, createBooking } from "../api";
import "../customer.css";

export default function Customer({ setToast }) {
  const [tables] = useState([
    { id: 1, seats: 2 },
    { id: 2, seats: 4 },
    { id: 3, seats: 4 },
    { id: 4, seats: 6 },
    { id: 5, seats: 2 }
  ]);

  const [bookings, setBookings] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const [form, setForm] = useState({
    name: "",
    people: "",
    time: ""
  });

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 2000);
    return () => clearInterval(interval);
  }, []);

  async function loadBookings() {
    try {
      const res = await getBookings();
      setBookings((res.data || []).filter(b => b.status !== "cancelled"));
    } catch {
      console.log("Failed to load bookings");
    }
  }

  async function submitReservation() {
    if (!selectedTable)
      return setToast("⚠ Please select a table");

    if (!form.name || !form.people || !form.time)
      return setToast("⚠ Please fill all fields");

    try {
      await createBooking({
        ...form,
        table: selectedTable,
      });

      setToast("🎉 Reservation created successfully!");
      setForm({ name: "", people: "", time: "" });
      setSelectedTable(null);
      loadBookings();
    } catch {
      setToast("❌ Failed to create reservation");
    }
  }

  return (
    <div className="customer-page">

      <h1 className="customer-title">Choose Your Table</h1>
      <p className="customer-sub">Tap a table to start your reservation</p>

      <div className="customer-seats-grid">
        {tables.map((tbl) => {
          const tableId = typeof tbl === "object" ? tbl.id : tbl;
          const isOccupied = bookings.some((b) => Number(b.table) === tableId);

          return (
            <div
              key={tableId}
              className="customer-seat-card"
              onClick={() => !isOccupied && setSelectedTable(tableId)}
              style={{
                border:
                  selectedTable === tableId
                    ? "2px solid var(--accent-2)"
                    : "2px solid transparent"
              }}
            >
              <div className="customer-seat-title">Table {tableId}</div>
              <div className="customer-seat-meta">Seats: {tbl.seats}</div>

              <span
                className={`customer-status ${isOccupied ? "occupied" : "available"}`}
              >
                {isOccupied ? "Occupied" : "Available"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="customer-form">
        <div className="customer-form-title">Make a Reservation</div>

        <input
          className="customer-input"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="customer-input"
          placeholder="Number of People"
          type="number"
          value={form.people}
          onChange={(e) => setForm({ ...form, people: e.target.value })}
        />

        <input
          className="customer-input"
          placeholder="Time (e.g. 6:30 PM)"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <button className="customer-btn" onClick={submitReservation}>
          Confirm Reservation
        </button>
      </div>
    </div>
  );
}
