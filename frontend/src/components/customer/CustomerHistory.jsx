
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../customer.css";
const API = "http://localhost:5000/api";

export default function CustomerHistory({ userPhone, setPage, lang = 'en' }) {
      // Add dark mode styles for history box
      React.useEffect(() => {
        const styleId = 'cust-history-darkmode';
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.innerHTML = `
            @media (prefers-color-scheme: dark) {
              .cust-history-list .cust-history-box {
                background: #232e52 !important;
                border-color: #7d6bff !important;
              }
              .cust-history-list .cust-history-box,
              .cust-history-list .cust-history-box span,
              .cust-history-list .cust-history-box div {
                color: #f3f4f6 !important;
              }
              .cust-history-list .cust-history-box .cancelled {
                color: #ff6b6b !important;
                background: #3b1f1f !important;
              }
            }
          `;
          document.head.appendChild(style);
        }
      }, []);
    // Helper to normalize phone numbers for matching
    const normalizePhone = (phone) => (phone || "").replace(/\D/g, "");

    useEffect(() => {
      const fetchHistory = async () => {
        try {
          const res = await axios.get(`${API}/bookings/history`);
          setHistory((res.data || []).filter(b => normalizePhone(b.phone) === normalizePhone(userPhone)));
        } catch {
          setHistory([]);
        }
        setLoading(false);
      };
      fetchHistory();
    }, [userPhone]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      cancelled: "(You cancelled this reservation)",
      completed: "(Success: Reservation completed)",
      history: "Booking History",
      noHistory: "No booking history found.",
      people: "People",
      table: "Table",
      time: "Time",
      date: "Date",
      back: "Back to Home"
    },
    zh: {
      cancelled: "（你已取消此预约）",
      completed: "（成功：预约已完成）",
      history: "历史记录",
      noHistory: "没有历史记录。",
      people: "人数",
      table: "餐桌",
      time: "时间",
      date: "日期",
      back: "返回首页"
    }
  };
  // Detect dark mode
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return (
    <div className={`cust-container fade-in${isDark ? ' dark' : ''}`} style={isDark ? { background: '#0a0f1a', borderRadius: '16px', border: '2px solid #181f2f', boxShadow: '0 2px 12px rgba(16,24,42,0.7)' } : { background: '#fff', borderRadius: '16px', border: '2px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <h1 className="cust-title" style={isDark ? { color: '#e6eef8', fontWeight: 900, letterSpacing: '1px' } : {}}>{lang === 'zh' ? '訂位紀錄' : t[lang].history}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : history.length === 0 ? (
        <div className="cust-error">{t[lang].noHistory}</div>
      ) : (
        <div className="cust-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
          {history.map((b) => (
            <div key={b.id} className={`cust-history-box${isDark ? ' dark' : ''}`} style={isDark ? {
              background: '#131a2a',
              border: '1.5px solid #22304a',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(16,24,42,0.8)',
              padding: '20px 28px',
              maxWidth: '370px',
              margin: '0 auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-start',
              fontFamily: 'Segoe UI, Arial, sans-serif',
              color: '#e6eef8'
            } : {
              background: '#fff',
              border: '1.5px solid #7d6bff',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              padding: '20px 28px',
              maxWidth: '370px',
              margin: '0 auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-start',
              fontFamily: 'Segoe UI, Arial, sans-serif',
              color: '#232e52'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                <span style={{ fontSize: '1.15em', fontWeight: 700, color: isDark ? '#e6eef8' : '#232e52', letterSpacing: '0.5px' }}>{b.name}</span>
                {b.cancelled && (
                  <span className="cancelled" style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', background: isDark ? '#3b1f1f' : '#fee2e2', borderRadius: '6px', padding: '2px 8px', marginLeft: '4px' }}>{t[lang].cancelled}</span>
                )}
                {!b.cancelled && b.completed && (
                  <span className="completed" style={{ color: '#16a34a', fontWeight: 600, fontSize: '13px', background: isDark ? '#1e3a2a' : '#dcfce7', borderRadius: '6px', padding: '2px 8px', marginLeft: '4px' }}>{t[lang].completed}</span>
                )}
              </div>
              <div style={{ fontSize: '15px', color: isDark ? '#e6eef8' : '#232e52', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isDark ? '1px solid #232e52' : '1px solid #e5e7eb', paddingBottom: '3px' }}>
                  <span style={{ fontWeight: 500 }}>{t[lang].people}:</span>
                  <span>{b.people}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isDark ? '1px solid #232e52' : '1px solid #e5e7eb', paddingBottom: '3px' }}>
                  <span style={{ fontWeight: 500 }}>{t[lang].table}:</span>
                  <span>{b.table}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: isDark ? '1px solid #232e52' : '1px solid #e5e7eb', paddingBottom: '3px' }}>
                  <span style={{ fontWeight: 500 }}>{t[lang].time}:</span>
                  <span>{b.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 500 }}>{t[lang].date}:</span>
                  <span>{b.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="cust-btn"
        style={isDark ? { marginTop: "32px", background: '#232e52', color: '#e6eef8', borderRadius: "8px", padding: "12px 32px", fontWeight: 600, fontSize: "1em", border: '1.5px solid #232e52' } : { marginTop: "32px", background: "#7d6bff", color: "#fff", borderRadius: "8px", padding: "12px 32px", fontWeight: 600, fontSize: "1em" }}
        onClick={() => setPage("customer")}
      >
        {lang === 'zh' ? '返回主頁' : t[lang].back}
      </button>
    </div>
  );
}
