import React, { useEffect, useState } from "react";
import { getBookings } from "../../api";
import "../../customer.css";
import "./TimeSlots.css";
import MiniBack from "./MiniBack";

export default function CustomerTablePage({ tableId, setPage, lang = 'en' }) {
  const t = {
    en: {
      title: "Table",
      timeSchedule: "Time Schedule",
      subtitle: "View hourly availability for this table",
      reserved: "Reserved",
      free: "Free"
    },
    zh: {
      title: "餐桌",
      timeSchedule: "时段表",
      subtitle: "查看此桌每小时是否已被预订",
      reserved: "已预订",
      free: "空闲"
    }
  };

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBookings();
        setBookings(res.data || []);
      } catch (e) {
        console.log("Failed to load bookings");
      }
    };

    load(); // 第一次载入

    // ⭐每 5 秒自动刷新最新预约状态（可删除）
    const timer = setInterval(load, 5000);

    return () => clearInterval(timer);
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

  const getStatus = (slot) =>
    bookings.some(
      (b) => Number(b.table) === Number(tableId) && b.time === slot
    )
      ? "reserved"
      : "free";

  return (
    <div className="cust-container fade-in">

      {/* ⭐ Apple 简洁返回按钮 */}
      <MiniBack onBack={() => setPage("customer")} lang={lang} />

      <h1 className="cust-title">{t[lang].title} {tableId} {t[lang].timeSchedule}</h1>
      <p className="cust-subtitle">{t[lang].subtitle}</p>

      <div className="cust-timeslot-list">
        {timeSlots.map((slot) => (
          <div key={slot} className="cust-timeslot-row">
            <span>{slot}</span>

            <span
              className={`cust-timeslot-badge ${
                getStatus(slot) === "reserved" ? "bad" : "good"
              }`}
            >
              {getStatus(slot) === "reserved" ? t[lang].reserved : t[lang].free}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
