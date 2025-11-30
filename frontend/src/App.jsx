import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

import CustomerHome from "./components/customer/CustomerHome";
import CustomerTablePage from "./components/customer/CustomerTablePage";
import CustomerReserve from "./components/customer/CustomerReserve";
import CustomerLogin from "./components/customer/CustomerLogin";

import Admin from "./components/Admin";
import Owner from "./components/Owner";

import Toast from "./components/Toast";
import ThemeToggle from "./components/ThemeToggle";

import "./App.css";

export default function App() {
  // ⭐ Default page
  const [page, setPage] = useState("login");

  // ⭐ User role
  const [userRole, setUserRole] = useState(""); // "customer" | "admin" | "owner"

  const [toast, setToast] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [userPhone, setUserPhone] = useState("");

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  // ⭐ Topbar title translations
  const t = {
    en: {
      brand: "Resto",
      reservation: "+ Reservation",
      dashboard: "Manager Panel",
      admin: "Admin Panel",
      customer: "Customer View",
      reserve: "Reserve Table",
      owner: "Owner Panel",
      table: "Table",
      details: "Details",
    },
    zh: {
      brand: "餐厅",
      reservation: "+ 预约",
      dashboard: "经理面板",
      admin: "管理员面板",
      customer: "顾客视图",
      reserve: "预约餐桌",
      owner: "老板面板",
      table: "餐桌",
      details: "详情",
    },
  };

  const getTopbarTitle = () => {
    if (page === "customer-table")
      return `${t[lang].table} ${selectedTable} ${t[lang].details}`;

    switch (page) {
      case "dashboard":
        return t[lang].dashboard;
      case "admin":
        return t[lang].admin;
      case "customer":
        return t[lang].customer;
      case "customer-reserve":
        return t[lang].reserve;
      case "owner":
        return t[lang].owner;
      default:
        return t[lang].brand;
    }
  };

  const isLoginPage = page === "login";

  return (
    <div className="layout">

      {/* ⭐ Login page hides sidebar */}
      {!isLoginPage && (
        <Sidebar setPage={setPage} lang={lang} userRole={userRole} />
      )}

      <div className="content">

        {/* ⭐ Hide topbar on login */}
        {!isLoginPage && (
          <div className="topbar">
            <div className="topbar-left">
              <h1 className="brand">🍽️ {t[lang].brand}</h1>
              <div className="top-sub">{getTopbarTitle()}</div>
            </div>

            <div className="topbar-right">
              <ThemeToggle />

              <div style={{ position: "relative", marginRight: "10px" }}>
                <button
                  className="mini-btn"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                >
                  {lang === "en" ? "English" : "中文"}
                </button>

                {showLangMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      minWidth: "150px",
                      zIndex: 1000,
                    }}
                  >
                    <button
                      onClick={() => {
                        changeLang("en");
                        setShowLangMenu(false);
                      }}
                    >
                      English
                    </button>

                    <button
                      onClick={() => {
                        changeLang("zh");
                        setShowLangMenu(false);
                      }}
                    >
                      中文
                    </button>
                  </div>
                )}
              </div>

              <button className="mini-btn" onClick={() => setPage("customer")}>
                {t[lang].reservation}
              </button>
            </div>
          </div>
        )}

        {/* ⭐ Page Switcher */}
        <main className="page-area fade-in">

          {/* LOGIN PAGE */}
          {page === "login" && (
            <CustomerLogin
              setPage={setPage}
              setUserPhone={setUserPhone}
              lang={lang}
              changeLang={changeLang}
              setUserRole={setUserRole}
            />
          )}

          {/* CUSTOMER PAGES */}
          {page === "customer" && (
            <CustomerHome
              setPage={setPage}
              setSelectedTable={setSelectedTable}
              lang={lang}
            />
          )}

          {page === "customer-table" && (
            <CustomerTablePage
              tableId={selectedTable}
              setPage={setPage}
              lang={lang}
            />
          )}

          {page === "customer-reserve" && (
            <CustomerReserve
              selectedTable={selectedTable}
              setPage={setPage}
              setToast={setToast}
              lang={lang}
              userPhone={userPhone}
            />
          )}

          {/* ADMIN PANEL (admin + owner) */}
          {page === "admin" &&
            (userRole === "admin" || userRole === "owner") && (
              <Admin setToast={setToast} lang={lang} />
            )}

          {/* OWNER PANEL (admin + owner) */}
          {page === "owner" &&
            (userRole === "admin" || userRole === "owner") && (
              <Owner lang={lang} userRole={userRole} />
            )}

          {/* DASHBOARD (owner only) */}
          {page === "dashboard" && userRole === "owner" && (
            <Dashboard lang={lang} />
          )}
        </main>
      </div>

      {toast && <Toast message={toast} close={() => setToast(null)} />}
    </div>
  );
}
