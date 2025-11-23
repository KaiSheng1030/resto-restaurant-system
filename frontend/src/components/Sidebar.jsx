import React from "react";

export default function Sidebar({ setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          Resto<span className="logo-dot">.</span>
        </div>
        <div className="subtitle">Reservations</div>
      </div>

      <nav className="nav">
        <button onClick={() => setPage("dashboard")}>Dashboard</button>

        {/* Reservation now goes to customer page */}
        <button onClick={() => setPage("customer")}>Make Reservation</button>

        <button onClick={() => setPage("admin")}>Admin Panel</button>
        <button onClick={() => setPage("customer")}>Customer</button>
        <button onClick={() => setPage("owner")}>Owner Panel</button>
      </nav>

      <footer className="sidebar-foot">v1.0 • Local</footer>
    </aside>
  );
}
