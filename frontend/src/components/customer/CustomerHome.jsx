import React, { useEffect, useState } from "react";
import { getBookings } from "../../api";
import "../../customer.css";

export default function CustomerHome({ setPage, setSelectedTable }) {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);

  // ⭐ 从 localStorage 获取桌子表
  useEffect(() => {
    const saved = localStorage.getItem("tables");
    if (saved) setTables(JSON.parse(saved));
    else setTables([1, 2, 3, 4, 5]); // default
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
      <h1 className="cust-title">可用餐桌</h1>
      <p className="cust-subtitle">顾客可实时查看餐桌是否有人预订</p>

      <div className="cust-table-grid">
        {tables.map((t) => (
          <div
            key={t}
            className={`cust-card ${hasBookings(t) ? "occupied" : "available"}`}
            onClick={() => {
              setSelectedTable(t);
              setPage("customer-table");
            }}
          >
            <div className="cust-table-id">餐桌 {t}</div>
            <div
              className={`cust-status ${
                hasBookings(t) ? "occupied" : "available"
              }`}
            >
              {hasBookings(t) ? "已预订" : "可用"}
            </div>
          </div>
        ))}
      </div>

      <button
        className="cust-primary-btn"
        onClick={() => setPage("customer-reserve")}
      >
        预约餐桌
      </button>
    </div>
  );
}
