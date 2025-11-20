import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import BookingForm from "./components/BookingForm";
import Admin from "./components/Admin";

import CustomerHome from "./components/customer/CustomerHome";
import CustomerTablePage from "./components/customer/CustomerTablePage";
import CustomerReserve from "./components/customer/CustomerReserve"; // ⭐ MUST ADD

import Owner from "./components/Owner";
import Toast from "./components/Toast";
import ThemeToggle from "./components/ThemeToggle";

import "./App.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  // ⭐ 保存选中的桌号
  const [selectedTable, setSelectedTable] = useState(null);

  // 顶部标题
  const getTopbarTitle = () => {
    switch (page) {
      case "dashboard":
        return "Manager Panel";
      case "reserve":
        return "Reservation Form";
      case "admin":
        return "Admin Panel";
      case "customer":
        return "Customer View";
      case "customer-table":
        return `Table ${selectedTable} Details`;
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

        {/* -------- Top Bar -------- */}
        <div className="topbar">
          <div className="topbar-left">
            <h1 className="brand">🍽️ Resto</h1>
            <div className="top-sub">{getTopbarTitle()}</div>
          </div>

          <div className="topbar-right">
            <ThemeToggle />
            <button className="mini-btn" onClick={() => setPage("reserve")}>
              + Reservation
            </button>
          </div>
        </div>

        {/* -------- Page Switch -------- */}
        <main className="page-area fade-in">

          {/* 顾客主页 */}
          {page === "customer" && (
            <CustomerHome
              setPage={setPage}
              setSelectedTable={setSelectedTable}
            />
          )}

          {page === "customer-table" && (
            <CustomerTablePage 
            tableId={selectedTable} 
            setPage={setPage}     // ⭐传进去
              />
          )}


          {page === "customer-reserve" && (
  <CustomerReserve
    selectedTable={selectedTable}
    setToast={setToast}
    setPage={setPage}
  />
)}


          {/* 原有页面 */}
          {page === "dashboard" && <Dashboard />}
          {page === "reserve" && <BookingForm setToast={setToast} />}
          {page === "admin" && <Admin setToast={setToast} />}
          {page === "owner" && <Owner />}
        </main>
      </div>

      {/* Toast 通知 */}
      {toast && <Toast message={toast} close={() => setToast(null)} />}
    </div>
  );
}
