import React, { useEffect, useState } from "react";
import { getBookings } from "../api";
import Tables from "./Tables";
import Charts from "./Charts";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getBookings();
        setBookings(res.data || []);
      } catch (e) {
        console.log("Failed to fetch bookings");
      }
    }
    load();
  }, []);

  const stats = {
    today: bookings.length,
    availableTables: Math.max(0, 5 - bookings.length),
    customers: bookings.reduce((sum, b) => sum + Number(b.people || 0), 0),
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="dashboard-grid">
        <div className="dash-card">
          <div className="dash-title">Bookings Today</div>
          <div className="dash-num">{stats.today}</div>
          <div className="dash-sub">Active reservations</div>
        </div>

        <div className="dash-card">
          <div className="dash-title">Available Tables</div>
          <div className="dash-num">{stats.availableTables}</div>
          <div className="dash-sub">Out of 5</div>
        </div>

        <div className="dash-card">
          <div className="dash-title">Total Customers</div>
          <div className="dash-num">{stats.customers}</div>
          <div className="dash-sub">People seated</div>
        </div>
      </div>

      {/* Table Status */}
      <h2 style={{ marginTop: "24px" }}>Table Status</h2>
      <Tables bookings={bookings} />

      {/* Charts Section */}
      <h2 style={{ marginTop: "24px" }}>Analytics</h2>
      <Charts bookings={bookings} />
    </div>
  );
}
