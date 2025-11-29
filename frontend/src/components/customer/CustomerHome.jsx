import React, { useEffect, useState } from "react";
import { getBookings, getTables } from "../../api";
import "../../customer.css";

export default function CustomerHome({ setPage, setSelectedTable, lang = 'en' }) {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);
  
  const t = {
    en: {
      title: "Available Tables",
      subtitle: "View real-time table availability",
      table: "Table",
      reserved: "Reserved",
      available: "Available",
      bookTable: "Book Table"
    },
    zh: {
      title: "可用餐桌",
      subtitle: "顾客可实时查看餐桌是否有人预订",
      table: "餐桌",
      reserved: "已预订",
      available: "可用",
      bookTable: "预约餐桌"
    }
  };

  // ⭐ 从 API 获取桌子表
  useEffect(() => {
    getTables()
      .then((res) => setTables(res.data || []))
      .catch(() => setTables([1, 2, 3, 4, 5].map(id => ({ id, capacity: 4, available: true }))));
  }, []);

  useEffect(() => {
    // ⭐ 拉取预订数据
    const load = async () => {
      try {
        const res = await getBookings();
        setBookings(res.data || []);
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

  // ⭐ 判断桌子是否有任何预订
  const hasBookings = (id) => {
    return bookings.some((b) => Number(b.table) === id);
  };

  // ⭐ 判断是否整天满
  const isFullyBooked = (id) => {
    const booked = bookings
      .filter((b) => Number(b.table) === id)
      .map((b) => b.time);

    return booked.length === timeSlots.length;
  };

  return (
    <div className="cust-container">
      <h1 className="cust-title">{t[lang].title}</h1>
      <p className="cust-subtitle">{t[lang].subtitle}</p>

      <div className="cust-table-grid">
        {(tables || []).map((table) => {
          const tableId = typeof table === 'object' ? table.id : table;
          return (
            <div
              key={tableId}
              className={`cust-card ${hasBookings(tableId) ? "occupied" : "available"}`}
              onClick={() => {
                setSelectedTable(tableId);
                setPage("customer-table");
              }}
            >
              <div className="cust-table-id">{t[lang].table} {tableId}</div>
              <div
                className={`cust-status ${
                  hasBookings(tableId) ? "occupied" : "available"
                }`}
              >
                {hasBookings(tableId) ? t[lang].reserved : t[lang].available}
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
