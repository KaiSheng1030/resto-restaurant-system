import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

import CustomerHome from "./components/customer/CustomerHome";
import CustomerTablePage from "./components/customer/CustomerTablePage";
import CustomerReserve from "./components/customer/CustomerReserve";

import Admin from "./components/Admin";
import Owner from "./components/Owner";

import Toast from "./components/Toast";
import ThemeToggle from "./components/ThemeToggle";

import "./App.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  // Topbar Page Names (Booking Form removed)
  const getTopbarTitle = () => {
    if (page === "customer-table") return `Table ${selectedTable} Details`;

    switch (page) {
      case "dashboard":
        return "Manager Panel";
      case "admin":
        return "Admin Panel";
      case "customer":
        return "Customer View";
      case "customer-reserve":
        return "Reserve Table";
      case "owner":
        return "Owner Panel";
      default:
        return "Resto";
    }
  };

  return (
    <div className="layout">
      <Sidebar setPage={setPage} />

      <div className="content">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <h1 className="brand">🍽️ Resto</h1>
            <div className="top-sub">{getTopbarTitle()}</div>
          </div>

          <div className="topbar-right">
            <ThemeToggle />

            {/* All reservation actions go to Customer View */}
            <button className="mini-btn" onClick={() => setPage("customer")}>
              + Reservation
            </button>
          </div>
        </div>

        {/* Page Switch */}
        <main className="page-area fade-in">
          {page === "customer" && (
            <CustomerHome
              setPage={setPage}
              setSelectedTable={setSelectedTable}
            />
          )}

          {page === "customer-table" && (
            <CustomerTablePage
              tableId={selectedTable}
              setPage={setPage}
            />
          )}

          {page === "customer-reserve" && (
            <CustomerReserve
              selectedTable={selectedTable}
              setToast={setToast}
              setPage={setPage}
            />
          )}

          {page === "dashboard" && <Dashboard />}
          {page === "admin" && <Admin setToast={setToast} />}
          {page === "owner" && <Owner />}
        </main>
      </div>

      {toast && <Toast message={toast} close={() => setToast(null)} />}
    </div>
  );
}
