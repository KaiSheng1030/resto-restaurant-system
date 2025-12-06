import React, { useState } from "react";

export default function Sidebar({ setPage, lang = "en", userRole, currentPage }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
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
      ownerPanel: "业主面板",
    },
  };

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          <div className="logo">
            Resto<span className="logo-dot">.</span>
          </div>
          {!isCollapsed && <div className="subtitle">{t[lang].reservations}</div>}
        </div>

        <nav className="nav">

        {/* ⭐ ADMIN SIDEBAR */}
        {userRole === "admin" && (
          <>
            <button 
              onClick={() => setPage("admin")}
              className={currentPage === "admin" ? "active" : ""}
              title={isCollapsed ? t[lang].adminPanel : ""}
            >
              {isCollapsed ? "📋" : t[lang].adminPanel}
            </button>

            <button 
              onClick={() => setPage("customer")}
              className={currentPage === "customer" || currentPage === "customer-table" || currentPage === "customer-reserve" ? "active" : ""}
              title={isCollapsed ? t[lang].customerView : ""}
            >
              {isCollapsed ? "👤" : t[lang].customerView}
            </button>
          </>
        )}

        {/* ⭐ OWNER SIDEBAR → FULL ACCESS */}
        {userRole === "owner" && (
          <>
            <button 
              onClick={() => setPage("dashboard")}
              className={currentPage === "dashboard" ? "active" : ""}
              title={isCollapsed ? t[lang].dashboard : ""}
            >
              {isCollapsed ? "📊" : t[lang].dashboard}
            </button>

            <button 
              onClick={() => setPage("admin")}
              className={currentPage === "admin" ? "active" : ""}
              title={isCollapsed ? t[lang].adminPanel : ""}
            >
              {isCollapsed ? "📋" : t[lang].adminPanel}
            </button>

            <button 
              onClick={() => setPage("customer")}
              className={currentPage === "customer" || currentPage === "customer-table" || currentPage === "customer-reserve" ? "active" : ""}
              title={isCollapsed ? t[lang].customerView : ""}
            >
              {isCollapsed ? "👤" : t[lang].customerView}
            </button>

            <button 
              onClick={() => setPage("owner")}
              className={currentPage === "owner" ? "active" : ""}
              title={isCollapsed ? t[lang].ownerPanel : ""}
            >
              {isCollapsed ? "⚙️" : t[lang].ownerPanel}
            </button>
          </>
        )}
      </nav>
      </aside>

      <button 
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? "»" : "«"}
      </button>
    </>
  );
}
