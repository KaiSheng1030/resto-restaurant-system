import React, { useState } from "react";
import { getBookings } from "../api";
import "./customer.css";

export default function CustomerFind({ setPage, setSelected }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const search = async () => {
    const res = await getBookings();
    const bookings = (res.data || []).filter(b => b.status !== "cancelled");

    const match = bookings.find(
      (b) =>
        b.name.toLowerCase() === input.toLowerCase()
    );

    if (!match) return setError("No reservation found");

    console.log("Selected booking:", match);
    console.log("Booking ID:", match._id);
    setSelected(match);
    setPage("customer-details");
  };

  return (
    <div className="cust-container fade-in">
      <h1 className="cust-title">Find Your Reservation</h1>

      <input
        className="cust-input"
        placeholder="Enter your name"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError("");
        }}
      />

      {error && <div className="cust-error">{error}</div>}

      <button className="cust-primary-btn" onClick={search}>
        Search
      </button>

      <button
        className="cust-secondary-btn"
        onClick={() => setPage("customer-home")}
      >
        Back
      </button>
    </div>
  );
}
