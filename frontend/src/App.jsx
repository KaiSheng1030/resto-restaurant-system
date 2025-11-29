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
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // Save language preference
  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  // Translations
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
      details: "Details"
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
      details: "详情"
    }
  };

  // Topbar Page Names
  const getTopbarTitle = () => {
    if (page === "customer-table") return `${t[lang].table} ${selectedTable} ${t[lang].details}`;

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

  return (
    <div className="layout">
      <Sidebar setPage={setPage} lang={lang} />

      <div className="content">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <h1 className="brand">🍽️ {t[lang].brand}</h1>
            <div className="top-sub">{getTopbarTitle()}</div>
          </div>

          <div className="topbar-right">
            <ThemeToggle />

            {/* Language Dropdown */}
            <div style={{ position: 'relative', marginRight: '10px' }}>
              <button 
                className="mini-btn" 
                onClick={() => setShowLangMenu(!showLangMenu)}
              >
                {lang === 'en' ? 'English' : '中文'}
              </button>
              
              {showLangMenu && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '150px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => {
                      changeLang('en');
                      setShowLangMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: lang === 'en' ? 'var(--accent)' : 'transparent',
                      color: lang === 'en' ? 'white' : 'var(--text)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: lang === 'en' ? '600' : '400'
                    }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLang('zh');
                      setShowLangMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: lang === 'zh' ? 'var(--accent)' : 'transparent',
                      color: lang === 'zh' ? 'white' : 'var(--text)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: lang === 'zh' ? '600' : '400'
                    }}
                  >
                    中文
                  </button>
                </div>
              )}
            </div>

            {/* All reservation actions go to Customer View */}
            <button className="mini-btn" onClick={() => setPage("customer")}>
              {t[lang].reservation}
            </button>
          </div>
        </div>

        {/* Page Switch */}
        <main className="page-area fade-in">
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
              setToast={setToast}
              setPage={setPage}
              lang={lang}
            />
          )}

          {page === "dashboard" && <Dashboard lang={lang} />}
          {page === "admin" && <Admin setToast={setToast} lang={lang} />}
          {page === "owner" && <Owner lang={lang} />}
        </main>
      </div>

      {toast && <Toast message={toast} close={() => setToast(null)} />}
    </div>
  );
}
