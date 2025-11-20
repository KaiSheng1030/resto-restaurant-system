import React, { useEffect, useState } from "react";
import { getBookings } from "../../api";
import "../../customer.css";

export default function CustomerHome({ setPage, setSelectedTable }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings().then((res) => setBookings(res.data || []));
  }, []);

  const tables = [1, 2, 3, 4, 5];

  const tableStatus = (id) =>
    bookings.some((b) => Number(b.table) === id) ? "occupied" : "available";

  return (
    <div className="cust-container">
      <h1 className="cust-title">可用餐桌</h1>
      <p className="cust-subtitle">顾客可实时查看餐桌是否有人预订</p>

      <div className="cust-table-grid">
        {tables.map((t) => (
          <div
            key={t}
            className={`cust-card ${tableStatus(t)}`}
            onClick={() => {
              setSelectedTable(t);
              setPage("customer-table");
            }}
          >
            <div className="cust-table-id">餐桌 {t}</div>

            <div
              className={`cust-status ${
                tableStatus(t) === "available" ? "available" : "occupied"
              }`}
            >
              {tableStatus(t) === "available" ? "可用" : "已预订"}
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
