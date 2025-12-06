import React, { useMemo } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

export default function Charts({ bookings = [], tables = [], lang = 'en' }) {

  /* ========================
     TRANSLATE
  ======================== */
  const t = {
    en: {
      weeklyBookings: "Weekly Bookings",
      tableUsage: "Table Usage",
      tableDistribution: "Table Distribution",
      table: "Table",
      mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu",
      fri: "Fri", sat: "Sat", sun: "Sun",
    },
    zh: {
      weeklyBookings: "每周预订",
      tableUsage: "餐桌使用率",
      tableDistribution: "餐桌分布",
      table: "餐桌",
      mon: "周一", tue: "周二", wed: "周三", thu: "周四",
      fri: "周五", sat: "周六", sun: "周日",
    },
  };

  /* ========================
     READ TABLE LIST
  ======================== */
  const tableIds = tables.map(t => (typeof t === "object" ? t.id : t));

  const safeTables = tableIds.length > 0 ? tableIds : [1, 2, 3, 4, 5];

  const usage = safeTables.map(
    tblId => bookings.filter(b => Number(b.table) === tblId).length
  );

  /* ========================
     DYNAMIC COLORS — NO DUPLICATES
  ======================== */
  const generateHSLColors = (n) => {
    let arr = [];
    for (let i = 0; i < n; i++) {
      const hue = (i * 360) / n;  // evenly spaced around color wheel
      arr.push(`hsl(${hue}, 75%, 55%)`);
    }
    return arr;
  };

  const pieColors = generateHSLColors(safeTables.length);

  /* ========================
     THEME
  ======================== */
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const text = isDark ? "#e6eef8" : "#0f172a";
  const grid = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const glow = isDark ? "rgba(78,163,255,0.9)" : "rgba(17,82,255,0.9)";
  const fill = isDark ? "rgba(78,163,255,0.22)" : "rgba(17,82,255,0.22)";

  /* ========================
     COMPACT OPTIONS
  ======================== */
  const baseOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 10 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? "rgba(30,41,59,0.93)" : "rgba(255,255,255,0.97)",
        titleColor: text,
        bodyColor: text,
        borderColor: grid,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    animation: { duration: 800 },
    scales: {
      x: { ticks: { color: text }, grid: { color: "transparent" } },
      y: { ticks: { color: text }, grid: { color: grid } },
    },
  }), [text, grid, isDark]);

  /* ========================
     CHART DATA
  ======================== */
  const weeklyLabels = [
    t[lang].mon, t[lang].tue, t[lang].wed, t[lang].thu,
    t[lang].fri, t[lang].sat, t[lang].sun
  ];

  const lineData = {
    labels: weeklyLabels,
    datasets: [{
      label: t[lang].weeklyBookings,
      data: [3, 4, 6, 2, 5, 8, 3],
      borderColor: glow,
      backgroundColor: fill,
      tension: 0.45,
      borderWidth: 3,
      pointRadius: 4,
      pointBackgroundColor: glow,
      fill: true,
    }],
  };

  const barData = {
    labels: safeTables.map(id => `${t[lang].table} ${id}`),
    datasets: [{
      label: t[lang].tableUsage,
      data: usage,
      backgroundColor: glow,
      borderRadius: 12,
      maxBarThickness: 40,
    }],
  };

  const pieData = {
    labels: safeTables.map(id => `${t[lang].table} ${id}`),
    datasets: [{
      data: usage,
      backgroundColor: pieColors,
      hoverOffset: 10,
    }],
  };

  /* ========================
     RENDER
  ======================== */
  return (
    <div className="charts-grid">

      {/* LINE */}
      <div className="card chart-card">
        <h3 className="chart-title">{t[lang].weeklyBookings}</h3>
        <div style={{ height: "180px" }}>
          <Line data={lineData} options={baseOptions} />
        </div>
      </div>

      {/* BAR */}
      <div className="card chart-card">
        <h3 className="chart-title">{t[lang].tableUsage}</h3>
        <div style={{ height: "180px" }}>
          <Bar data={barData} options={baseOptions} />
        </div>
      </div>

      {/* PIE */}
      <div className="card chart-card">
        <h3 className="chart-title">{t[lang].tableDistribution}</h3>

        <div
          className="custom-legend"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 16px",
            marginBottom: 10,
          }}
        >
          {safeTables.map((id, idx) => (
            <div key={id}>
              <span
                className="legend-box"
                style={{
                  background: pieColors[idx],
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  display: "inline-block",
                  marginRight: 6,
                }}
              ></span>
              {t[lang].table} {id}
            </div>
          ))}
        </div>

        <div style={{ height: "180px" }}>
          <Pie
            data={pieData}
            options={{
              animation: baseOptions.animation,
              plugins: { legend: false },
            }}
          />
        </div>
      </div>

    </div>
  );
}
