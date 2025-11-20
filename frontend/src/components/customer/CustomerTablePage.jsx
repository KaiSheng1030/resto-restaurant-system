import React, { useEffect, useState } from "react";
import { getBookings } from "../../api";
import "../../customer.css";
import "./TimeSlots.css";
import MiniBack from "./MiniBack";   // ⭐ Apple 风格返回按钮

export default function CustomerTablePage({ tableId, setPage }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings().then((res) => setBookings(res.data || []));
  }, []);

  const timeSlots = [
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
  ];

  const getStatus = (slot) => {
    return bookings.some(
      (b) => Number(b.table) === Number(tableId) && b.time === slot
    )
      ? "reserved"
      : "free";
  };

  return (
    <div className="cust-container fade-in">

      {/* ⭐ Apple 风格返回按钮 */}
      <MiniBack onBack={() => setPage("customer")} />

      <h1 className="cust-title">餐桌 {tableId} 时段表</h1>
      <p className="cust-subtitle">查看此桌每个时间段的预约状况</p>

      <div className="cust-timeslot-list">
        {timeSlots.map((slot) => (
          <div key={slot} className="cust-timeslot-row">
            <span>{slot}</span>
            <span
              className={`cust-timeslot-badge ${
                getStatus(slot) === "reserved" ? "bad" : "good"
              }`}
            >
              {getStatus(slot) === "reserved" ? "已预订" : "空闲"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
