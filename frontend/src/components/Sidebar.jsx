import React from "react";

export default function Sidebar({ setPage, lang = 'en' }) {
  const t = {
    en: {
      reservations: "Reservations",
      dashboard: "Dashboard",
      makeReservation: "Make Reservation",
      adminPanel: "Admin Panel",
      customer: "Customer",
      ownerPanel: "Owner Panel"
    },
    zh: {
      reservations: "预订系统",
      dashboard: "仪表板",
      makeReservation: "预订餐桌",
      adminPanel: "管理面板",
      customer: "客户",
      ownerPanel: "业主面板"
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          Resto<span className="logo-dot">.</span>
        </div>
        <div className="subtitle">{t[lang].reservations}</div>
      </div>

      <nav className="nav">
        <button onClick={() => setPage("dashboard")}>{t[lang].dashboard}</button>

        {/* Reservation now goes to customer page */}
        <button onClick={() => setPage("customer")}>{t[lang].makeReservation}</button>

        <button onClick={() => setPage("admin")}>{t[lang].adminPanel}</button>
        <button onClick={() => setPage("customer")}>{t[lang].customer}</button>
        <button onClick={() => setPage("owner")}>{t[lang].ownerPanel}</button>
      </nav>

      <footer className="sidebar-foot">v1.0 • Local</footer>
    </aside>
  );
}
