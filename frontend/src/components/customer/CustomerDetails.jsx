import React from "react";
import { cancelBooking } from "../api";
import "./customer.css";

export default function CustomerDetails({ setPage, selected, setToast }) {
  if (!selected)
    return <div className="cust-container">No reservation loaded</div>;

  return (
    <div className="cust-container fade-in">

      <div className="cust-ticket">
        <h2>{selected.name}</h2>

        <div className="cust-ticket-line">
          <span>People</span>
          <span>{selected.people}</span>
        </div>

        <div className="cust-ticket-line">
          <span>Table</span>
          <span>{selected.table}</span>
        </div>

        <div className="cust-ticket-line">
          <span>Time</span>
          <span>{selected.time}</span>
        </div>
      </div>

      <button
        className="cust-primary-btn"
        onClick={() => setPage("customer-home")}
      >
        Back to Home
      </button>

      <button
        className="cust-secondary-btn"
        onClick={async () => {
          await cancelBooking(selected.id);
          setToast("Reservation cancelled");
          setPage("customer-home");
        }}
      >
        Cancel Reservation
      </button>

    </div>
  );
}
