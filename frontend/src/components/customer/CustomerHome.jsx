import React, { useEffect, useState } from "react";
import { getBookings, getTables } from "../../api";
import FloorPlan from "../FloorPlan";
import "../../customer.css";

export default function CustomerHome({ setPage, setSelectedTable, lang = 'en' }) {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  
  const t = {
    en: {
      title: "Available Tables",
      subtitle: "View real-time table availability",
      hint: "💡 Click on any table to see available time slots",
      table: "Table",
      seats: "seats",
      reserved: "Fully Booked",
      available: "Available",
      partiallyBooked: "Partially Booked",
      slotsBooked: "slots booked",
      bookTable: "Book Table",
      clickForDetails: "Click for time slots"
    },
    zh: {
      title: "可用餐桌",
      subtitle: "顾客可实时查看餐桌是否有人预订",
      hint: "💡 点击任何餐桌查看可用时间段",
      table: "餐桌",
      seats: "个座位",
      reserved: "已订满",
      available: "可用",
      partiallyBooked: "部分已订",
      slotsBooked: "时段已订",
      bookTable: "预约餐桌",
      clickForDetails: "点击查看时间段"
    }
  };

  // ⭐ 从 API 获取桌子表
  useEffect(() => {
    getTables()
      .then((res) => setTables(res.data || []))
      .catch(() => setTables([1, 2, 3, 4, 5].map(id => ({ id, capacity: 4, available: true })))); 
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBookings();
        setBookings((res.data || []).filter(b => b.status !== "cancelled"));
      } catch (err) {
        console.log("Failed to fetch bookings");
      }
    };

    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  // ⭐ 所有营业时间
  const timeSlots = [
    "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00",
    "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00",
    "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00",
  ];

  // ⭐ 判断是否整天满（你想要的逻辑）
  const isFullyBooked = (id) => {
    const bookedTimes = bookings
      .filter((b) => Number(b.table) === id)
      .map((b) => b.time);

    return bookedTimes.length === timeSlots.length; // 🔥 所有时段都被订 = FULL
  };

  return (
    <div className="cust-container">
      {/* Floor Plan First */}
      <div style={{ position: 'relative' }}>
        <FloorPlan tables={tables} bookings={bookings} lang={lang} />
        <p className="floorplan-note">
          * {lang === 'en' 
            ? 'Please view this floor plan to select your preferred location before making a reservation.' 
            : '请查看此平面图以在预订前选择您的首选位置。'}
        </p>
      </div>

      <h1 className="cust-title" style={{ 
        fontSize: '28px', 
        fontWeight: '800', 
        color: '#000', 
        marginBottom: '4px',
        marginTop: '40px',
        textAlign: 'center',
        display: 'block'
      }}>
        {t[lang].title}
      </h1>
      <p className="cust-subtitle" style={{ 
        fontSize: '15px', 
        color: '#666', 
        marginBottom: '26px',
        textAlign: 'center',
        display: 'block'
      }}>
        {t[lang].subtitle}
      </p>
      
      {/* Hint/Reminder */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "12px 16px",
        borderRadius: "12px",
        marginBottom: "20px",
        fontSize: "0.9em",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)"
      }}>
        {t[lang].hint}
      </div>

      <div className="cust-table-grid">
        {[...(tables || [])].sort((a, b) => {
          const idA = typeof a === 'object' ? a.id : a;
          const idB = typeof b === 'object' ? b.id : b;
          return Number(idA) - Number(idB);
        }).map((table) => {
          const tableId = typeof table === 'object' ? table.id : table;
          const capacity = typeof table === 'object' ? table.capacity : 4;
          
          const bookedCount = bookings.filter((b) => Number(b.table) === tableId).length;
          const totalSlots = timeSlots.length;
          const fullyBooked = isFullyBooked(tableId);
          const partiallyBooked = bookedCount > 0 && bookedCount < totalSlots;

          return (
            <div
              key={tableId}
              className={`cust-card ${fullyBooked ? "occupied" : partiallyBooked ? "partial" : "available"}`}
              onClick={() => {
                setSelectedTable(tableId);
                setPage("customer-table");
              }}
              style={{ cursor: "pointer" }}
            >
              <div>
                <div className="cust-table-id">
                  {t[lang].table} {tableId}
                  <span style={{ fontSize: "0.75em", opacity: 0.7, marginLeft: "6px", fontWeight: 500 }}>
                    ({capacity} {t[lang].seats})
                  </span>
                </div>
                {/* Booking counter below table name */}
                <div style={{
                  fontSize: "0.75em",
                  marginTop: "4px",
                  opacity: 0.65,
                  fontStyle: "italic",
                  color: "var(--muted)"
                }}>
                  {bookedCount > 0 ? `${bookedCount}/${totalSlots} ${t[lang].slotsBooked}` : t[lang].clickForDetails}
                </div>
              </div>

              <div
                className={`cust-status ${
                  fullyBooked ? "occupied" : partiallyBooked ? "partial" : "available"
                }`}
              >
                {fullyBooked ? t[lang].reserved : partiallyBooked ? t[lang].partiallyBooked : t[lang].available}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="cust-primary-btn"
        onClick={() => setPage("customer-reserve")}
      >
        {t[lang].bookTable}
      </button>
    </div>
  );
}
