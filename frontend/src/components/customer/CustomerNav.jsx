import React from "react";
import "../../customer.css";

export default function CustomerNav({ setPage }) {
  return (
    <div className="cust-nav">
      <button onClick={() => setPage("customer-home")}>Tables</button>
      <button onClick={() => setPage("customer-reserve")}>Reserve</button>
      <button onClick={() => setPage("customer-find")}>My Reservation</button>
      <button onClick={() => setPage("customer-history")}>History</button>
    </div>
  );
}
