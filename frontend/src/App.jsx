import CustomerHistory from "./components/customer/CustomerHistory";
import React, { useState } from "react";
import { cancelBooking, getBookings } from "./api";
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
  // ⭐ Default page - require login for new sessions, but allow refresh to maintain page
  const [page, setPage] = useState(() => {
    const isActiveSession = sessionStorage.getItem("activeSession");
    
    // If no active session, force login
    if (!isActiveSession) {
      return "login";
    }
    
    // Active session exists - restore page from localStorage
    const savedPage = localStorage.getItem("currentPage");
    const savedRole = localStorage.getItem("role");
    return savedRole ? (savedPage || "customer") : "login";
  });

  // ⭐ User role - restore from localStorage only if active session exists
  const [userRole, setUserRole] = useState(() => {
    const isActiveSession = sessionStorage.getItem("activeSession");
    return isActiveSession ? (localStorage.getItem("role") || "") : "";
  });

  const [toast, setToast] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showBookingHint, setShowBookingHint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [customerBookings, setCustomerBookings] = useState([]);

  // Helper to normalize phone numbers for matching
  const normalizePhone = (phone) => (phone || "").replace(/\D/g, "");

  // Load bookings for this user (by phone) when opening My Reservations
  const loadCustomerBookings = async () => {
    if (!userPhone) return setCustomerBookings([]);
    try {
      const res = await getBookings();
      // Only show bookings for this phone number (normalized)
      setCustomerBookings((res.data || []).filter(b => normalizePhone(b.phone) === normalizePhone(userPhone)));
    } catch {
      setCustomerBookings([]);
    }
  };

  const [userPhone, setUserPhone] = useState(() => {
    return localStorage.getItem("userPhone") || "";
  });

  const [confirmCancel, setConfirmCancel] = useState({ show: false, booking: null });

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  // ⭐ Wrap setPage to also save to localStorage
  const handleSetPage = (newPage) => {
    setPage(newPage);
    if (newPage !== "login") {
      localStorage.setItem("currentPage", newPage);
    }
  };

  // ⭐ Wrap setUserRole to also save to localStorage and create session
  const handleSetUserRole = (role) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem("role", role);
      // Mark this as an active session
      sessionStorage.setItem("activeSession", "true");
    }
  };

  // ⭐ Wrap setUserPhone to also save to localStorage
  const handleSetUserPhone = (phone) => {
    setUserPhone(phone);
    if (phone) {
      localStorage.setItem("userPhone", phone);
    }
  };

  // ⭐ Logout function
  const handleLogout = () => {
    setUserRole("");
    setUserPhone("");
    setPage("login");
    // Clear localStorage and session
    localStorage.removeItem("role");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("currentPage");
    sessionStorage.removeItem("activeSession");
    setToast(lang === "en" ? "✅ Logged out successfully!" : "✅ 登出成功！");
  };

  // ⭐ Topbar title translations
  const t = {
    en: {
      brand: "Resto",
      reservation: "+ Reservation",
      logout: "Logout",
      notifications: "My Reservations",
      notificationsSingle: "My Reservation",
      noBookings: "No reservations yet",
      table: "Table",
      date: "Date",
      time: "Time",
      people: "People",
      name: "Name",
      dashboard: "Manager Panel",
      admin: "Admin Panel",
      customer: "Customer View",
      reserve: "Reserve Table",
      owner: "Owner Panel",
      table: "Table",
      details: "Details",
      history: "History",
    },
    zh: {
      brand: "Resto",
      reservation: "+ 预约",
      logout: "登出",
      notifications: "我的预约",
      notificationsSingle: "我的预约",
      noBookings: "暂无预约",
      table: "餐桌",
      date: "日期",
      time: "时间",
      people: "人数",
      name: "姓名",
      dashboard: "经理面板",
      admin: "管理员面板",
      customer: "顾客视图",
      reserve: "预约餐桌",
      owner: "业主面板",
      table: "餐桌",
      details: "详情",
      history: "历史记录",
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
    <div className="layout" style={{ gridTemplateColumns: userRole === "customer" ? "1fr" : undefined }}>

      {/* ⭐ Login page hides sidebar, customer has no sidebar */}
      {!isLoginPage && userRole !== "customer" && (
        <Sidebar setPage={handleSetPage} lang={lang} userRole={userRole} currentPage={page} />
      )}

      <div className="content">

        {/* ⭐ Hide topbar on login */}
        {!isLoginPage && (
          <div className="topbar">
            <div className="topbar-left">
              <h1 className="brand">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#7d6bff" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M7 2C6.448 2 6 2.448 6 3V10C6 11.657 7.343 13 9 13V22H11V13C12.657 13 14 11.657 14 10V3C14 2.448 13.552 2 13 2H12V8H10V2H9V8H7V2H7Z"/>
                  <path d="M18 2C16.343 2 15 3.343 15 5V10C15 11.657 16.343 13 18 13C19.657 13 21 11.657 21 10V5C21 3.343 19.657 2 18 2Z"/>
                </svg>
                Resto
              </h1>
              <div className="top-sub">{getTopbarTitle()}</div>
            </div>

            <div className="topbar-right">
              <ThemeToggle />

              {userRole === "customer" && (
                <button 
                  className="mini-btn notification-btn" 
                  onClick={() => {
                    loadCustomerBookings();
                    setShowNotifications(true);
                  }}
                >
                  🔔
                </button>
              )}

              <div style={{ position: "relative", marginRight: "10px" }}>
                <button
                  className="mini-btn"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                >
                  {lang === "en" ? "English" : "中文"}
                </button>

                {showLangMenu && (
                  <div className="lang-dropdown">
                    <button
                      className={`lang-option ${lang === "en" ? "active" : ""}`}
                      onClick={() => {
                        changeLang("en");
                        setShowLangMenu(false);
                      }}
                    >
                      <span className="lang-text">English</span>
                      {lang === "en" && <span className="lang-check">✓</span>}
                    </button>

                    <button
                      className={`lang-option ${lang === "zh" ? "active" : ""}`}
                      onClick={() => {
                        changeLang("zh");
                        setShowLangMenu(false);
                      }}
                    >
                      <span className="lang-text">中文</span>
                      {lang === "zh" && <span className="lang-check">✓</span>}
                    </button>
                  </div>
                )}
              </div>

              <button 
                className="mini-btn reservation-btn"
                onClick={() => {
                  handleSetPage("customer");
                  if (userRole === "customer") {
                    setShowBookingHint(true);
                    setTimeout(() => {
                      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                    }, 100);
                    setTimeout(() => {
                      setShowBookingHint(false);
                    }, 5000);
                  }
                }}
              >
                {t[lang].reservation}
              </button>


              {userRole === "customer" && (
                <button
                  className="mini-btn"
                  style={{
                    marginLeft: 8,
                    background: 'linear-gradient(135deg, #a58fff 0%, #7d6bff 100%)',
                    color: '#fff',
                    border: '1px solid #cbbfff',
                  }}
                  onClick={() => handleSetPage("customer-history")}
                >
                  {lang === "zh" ? t.zh.history : t.en.history}
                </button>
              )}

              <button 
                className="mini-btn logout-btn" 
                onClick={handleLogout}
              >
                {t[lang].logout}
              </button>
            </div>
          </div>
        )}

        {/* ⭐ Page Switcher */}
        <main className="page-area fade-in">

          {/* LOGIN PAGE */}
          {page === "login" && (
            <CustomerLogin
              setPage={handleSetPage}
              setUserPhone={handleSetUserPhone}
              lang={lang}
              changeLang={changeLang}
              setUserRole={handleSetUserRole}
            />
          )}

          {/* CUSTOMER PAGES */}
          {page === "customer" && (
            <div style={{ position: "relative", width: "100%" }}>
              <CustomerHome
                setPage={handleSetPage}
                setSelectedTable={setSelectedTable}
                lang={lang}
              />
              {showBookingHint && (
                <div className="booking-hint-pointer">
                  <div className="booking-hint-box">
                    <div className="booking-hint-icon">👈</div>
                    <p className="booking-hint-text">
                      {lang === "en" 
                        ? "Click on this button to make reservation" 
                        : "点击此按钮进行预订"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {page === "customer-table" && (
            <CustomerTablePage
              tableId={selectedTable}
              setPage={handleSetPage}
              lang={lang}
            />
          )}


          {page === "customer-reserve" && (
            <CustomerReserve
              selectedTable={selectedTable}
              setPage={handleSetPage}
              setToast={setToast}
              lang={lang}
              userPhone={userPhone}
              setCustomerBookings={setCustomerBookings}
            />
          )}

          {page === "customer-history" && userRole === "customer" && (
            <CustomerHistory userPhone={userPhone} setPage={handleSetPage} lang={lang} />
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

      {/* Notification Modal */}
      {showNotifications && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000
          }}
          onClick={() => setShowNotifications(false)}
        >
          <div 
            className={`my-reservation-modal${document.documentElement.getAttribute('data-theme') === 'dark' ? ' dark' : ''}`}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 className="my-reservation-title" style={{ margin: 0, fontSize: "1.5em", color: "#0f172a", fontWeight: 800, letterSpacing: '0.5px' }}>{t[lang].notificationsSingle}</h2>
              <button 
                onClick={() => setShowNotifications(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280"
                }}
              >
                ×
              </button>
            </div>
      {/* Add dark mode styles for My Reservations modal */}
      <style>{`
        @media (prefers-color-scheme: dark) {
          .my-reservation-modal {
            background: #232e52 !important;
            border: 2px solid #7d6bff !important;
            box-shadow: 0 2px 12px rgba(125,107,255,0.15) !important;
          }
          .my-reservation-title {
            color: #7d6bff !important;
            text-shadow: 0 1px 2px #232e52;
            font-weight: 900 !important;
            letter-spacing: 1px !important;
          }
          .my-reservation-modal,
          .my-reservation-modal div,
          .my-reservation-modal span,
          .my-reservation-modal p {
            color: #cbd5e1 !important;
          }
          .my-reservation-modal .reservation-card {
            background: #232e52 !important;
            border-color: #7d6bff !important;
          }
          .my-reservation-modal .reservation-card span,
          .my-reservation-modal .reservation-card div {
            color: #f3f4f6 !important;
          }
        }
      `}</style>

            {customerBookings.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", padding: "40px 0" }}>
                {t[lang].noBookings}
              </p>
            ) : (
              <div>
                {customerBookings.map((booking, index) => (
                  <div 
                    key={index}
                    className={`reservation-card${document.documentElement.getAttribute('data-theme') === 'dark' ? ' dark' : ''}`}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "12px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "600", color: "#0f172a" }}>
                        {t[lang].table} {booking.table}
                      </span>
                      <span style={{ color: "#16a34a", fontWeight: "500" }}>✓</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
                      <div><strong>{t[lang].name}:</strong> {booking.name}</div>
                      <div><strong>{t[lang].date}:</strong> {booking.date}</div>
                      <div><strong>{t[lang].time}:</strong> {booking.time}</div>
                      <div><strong>{t[lang].people}:</strong> {booking.people}</div>
                    </div>
                    <button
                      style={{
                        marginTop: "12px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                      onClick={() => setConfirmCancel({ show: true, booking })}
                    >
                      {lang === "en" ? "Cancel Reservation" : "取消预约"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Cancel Reservation Confirmation Dialog */}
      {confirmCancel?.show && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20000
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "32px 24px",
            minWidth: "320px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.2em", marginBottom: "18px", color: "#ef4444", fontWeight: 700 }}>
              {lang === "en" ? "Cancel reservation?" : "确认取消预约？"}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "18px" }}>
              <button
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 24px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
                onClick={async () => {
                  try {
                    await cancelBooking(confirmCancel.booking.id);
                    setCustomerBookings(prev => prev.filter(b => b.id !== confirmCancel.booking.id));
                    setToast(lang === "en" ? "Reservation cancelled." : "预约已取消。");
                  } catch {
                    setToast(lang === "en" ? "Failed to cancel." : "取消失败。");
                  }
                  setConfirmCancel({ show: false, booking: null });
                }}
              >
                {lang === "en" ? "Yes" : "是"}
              </button>
              <button
                style={{
                  background: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 24px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
                onClick={() => setConfirmCancel({ show: false, booking: null })}
              >
                {lang === "en" ? "No" : "否"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
