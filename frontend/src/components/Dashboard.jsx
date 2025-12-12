import React, { useEffect, useState } from "react";
import { getBookings, getTables } from "../api";
import Tables from "./Tables";
import Charts from "./Charts";

export default function Dashboard({ lang = 'en' }) {
  const t = {
    en: {
      bookingsToday: "Bookings Today",
      availableTables: "Available Tables",
      outOf: "Out of",
      totalCustomers: "Total Customers",
      tableStatus: "Table Status",
      analytics: "Analytics"
    },
    zh: {
      bookingsToday: "今日预订",
      availableTables: "可用餐桌",
      outOf: "总共",
      totalCustomers: "总客人数",
      tableStatus: "餐桌状态",
      analytics: "分析"
    }
  };

  const [bookings, setBookings] = useState([]);
  const [tables, setTables] = useState([]);

  // ⭐ 读取桌子数量（来自 Owner Panel）
  useEffect(() => {
    const loadTables = async () => {
      try {
        const res = await getTables();
        console.log("Dashboard loaded tables:", res.data);
        setTables(res.data || []);
      } catch (e) {
        console.log("Failed to fetch tables:", e);
        setTables([]);
      }
    };
    loadTables();
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

  // ⭐ 只统计未取消的预订
  const activeBookings = bookings.filter(b => b.status !== "cancelled");
  const stats = {
    today: activeBookings.length,
    availableTables: Math.max(0, tables.length - activeBookings.length),
    customers: activeBookings.reduce((sum, b) => sum + Number(b.people || 0), 0),
  };

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-grid">

        <div className="dash-card animate-card">
          <div className="dash-title">{t[lang].bookingsToday}</div>
          <div className="dash-num">{stats.today}</div>
        </div>

        <div className="dash-card animate-card">
          <div className="dash-title">{t[lang].availableTables}</div>
          <div className="dash-num">{stats.availableTables}</div>
          <div className="dash-sub">{t[lang].outOf} {tables.length}</div>
        </div>

        <div className="dash-card animate-card">
          <div className="dash-title">{t[lang].totalCustomers}</div>
          <div className="dash-num">{stats.customers}</div>
        </div>

      </div>

      <h2 className="section-title">{t[lang].tableStatus}</h2>
      <Tables bookings={activeBookings} tables={tables} lang={lang} />

      <h2 className="section-title">{t[lang].analytics}</h2>
      <Charts bookings={activeBookings} tables={tables} lang={lang} />
    </div>
  );
}
