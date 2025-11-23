import React, { useEffect, useState } from "react";
import { getBookings } from "../api";
import Tables from "./Tables";
import Charts from "./Charts";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);

  // ⭐ 读取桌子数量（来自 Owner Panel）
  useEffect(() => {
    const saved = localStorage.getItem("tables");
    if (saved) setTables(JSON.parse(saved));
    else setTables([1, 2, 3, 4, 5]);
  }, []);

  // ⭐ 自动刷新 booking
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBookings();
        setBookings(res.data || []);
      } catch (e) {
        console.log("Failed to fetch bookings");
      }
    };

    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  // ⭐ 动态统计
  const stats = {
    today: bookings.length,
    availableTables: Math.max(0, tables.length - bookings.length),
    customers: bookings.reduce((sum, b) => sum + Number(b.people || 0), 0),
  };

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-grid">

        <div className="dash-card animate-card">
          <div className="dash-title">Bookings Today</div>
          <div className="dash-num">{stats.today}</div>
        </div>

        <div className="dash-card animate-card">
          <div className="dash-title">Available Tables</div>
          <div className="dash-num">{stats.availableTables}</div>
          <div className="dash-sub">Out of {tables.length}</div>
        </div>

        <div className="dash-card animate-card">
          <div className="dash-title">Total Customers</div>
          <div className="dash-num">{stats.customers}</div>
        </div>

      </div>

      <h2 className="section-title">Table Status</h2>
      <Tables bookings={bookings} />

      <h2 className="section-title">Analytics</h2>
      <Charts bookings={bookings} />
    </div>
  );
}
