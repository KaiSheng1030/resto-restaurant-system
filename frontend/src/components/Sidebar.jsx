import React from "react";

export default function Sidebar({ setPage, lang = "en", userRole }) {
  const t = {
    en: {
      reservations: "Reservations",
      dashboard: "Dashboard",
      makeReservation: "Make Reservation",
      adminPanel: "Admin Panel",
      customerView: "Customer",
      ownerPanel: "Owner Panel",
    },
    zh: {
      reservations: "预订系统",
      dashboard: "仪表板",
      makeReservation: "预订餐桌",
      adminPanel: "管理面板",
      customerView: "顾客",
      ownerPanel: "老板面板",
    },
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

        {/* ⭐ ADMIN SIDEBAR */}
        {userRole === "admin" && (
          <>
            <button onClick={() => setPage("admin")}>
              {t[lang].adminPanel}
            </button>

            <button onClick={() => setPage("customer")}>
              {t[lang].makeReservation}
            </button>

            <button onClick={() => setPage("customer")}>
              {t[lang].customerView}
            </button>
          </>
        )}

        {/* ⭐ OWNER SIDEBAR → FULL ACCESS */}
        {userRole === "owner" && (
          <>
            <button onClick={() => setPage("dashboard")}>
              {t[lang].dashboard}
            </button>

            <button onClick={() => setPage("admin")}>
              {t[lang].adminPanel}
            </button>

            <button onClick={() => setPage("customer")}>
              {t[lang].customerView}
            </button>

            <button onClick={() => setPage("customer")}>
              {t[lang].makeReservation}
            </button>

            <button onClick={() => setPage("owner")}>
              {t[lang].ownerPanel}
            </button>
          </>
        )}
      </nav>

      <footer className="sidebar-foot">v1.0 • Local</footer>
    </aside>
  );
}
