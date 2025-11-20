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

        {/* MAIN PAGES */}
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("reserve")}>Make Reservation</button>
        <button onClick={() => setPage("admin")}>Admin Panel</button>

        {/* CUSTOMER VIEW */}
        <button onClick={() => setPage("customer")}>Customer</button>

        {/* ⭐ OWNER PANEL */}
        <button onClick={() => setPage("owner")}>Owner Panel</button>

      </nav>

      <footer className="sidebar-foot">v1.0 • Local</footer>
    </aside>
  );
}
