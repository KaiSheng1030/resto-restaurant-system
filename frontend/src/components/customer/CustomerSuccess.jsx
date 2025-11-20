import React from "react";
import "./customer.css";

export default function CustomerSuccess({ setPage }) {
  return (
    <div className="cust-container fade-in">
      <div className="cust-success-card">
        <h2>Reservation Confirmed</h2>
        <p>Your table has been successfully reserved.</p>
      </div>

      <button
        className="cust-primary-btn"
        onClick={() => setPage("customer-home")}
      >
        Back to Home
      </button>
    </div>
  );
}
