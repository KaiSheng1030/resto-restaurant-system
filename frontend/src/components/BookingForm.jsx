import React, { useState } from "react";
import { createBooking } from "../api";

export default function BookingForm({ setToast }) {
  const [name, setName] = useState("");
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignedTable, setAssignedTable] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !date || !time) {
      setToast?.("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        people: Number(people),
        time: `${date} ${time}`
      };

      const res = await createBooking(payload);
      const tableId = res.data?.table;
      setAssignedTable(tableId);

      setToast?.(tableId ? `Reservation Created! Table ${tableId} assigned.` : "Reservation Created!");
      setName("");
      setPeople(2);
      setDate("");
      setTime("");
      setTimeout(() => setAssignedTable(null), 3000);

    } catch (err) {
      console.log(err.response?.data);
      setToast?.(err.response?.data?.message || "Failed to create reservation");
    }

    setLoading(false);
  }

  return (
    <div className="form-card">
      <h2>Create Reservation</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Customer name" />
        <input type="number" min="1" value={people} onChange={e => setPeople(e.target.value)} placeholder="People" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Saving..." : "Book Now"}
        </button>
      </form>
      {assignedTable && (
        <div className="assigned-table-info" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px', fontSize: '14px', color: '#2e7d32' }}>
          ✓ Table {assignedTable} has been assigned to you.
        </div>
      )}
    </div>
  );
}
