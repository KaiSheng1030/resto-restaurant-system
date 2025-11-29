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

export default function Charts({ bookings = [], lang = 'en' }) {
  const t = {
    en: {
      weeklyBookings: "Weekly Bookings",
      tableUsage: "Table Usage",
      tableDistribution: "Table Distribution",
      table: "Table",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      sun: "Sun"
    },
    zh: {
      weeklyBookings: "每周预订",
      tableUsage: "餐桌使用率",
      tableDistribution: "餐桌分布",
      table: "餐桌",
      mon: "周一",
      tue: "周二",
      wed: "周三",
      thu: "周四",
      fri: "周五",
      sat: "周六",
      sun: "周日"
    }
  };

  const weeklyLabels = [t[lang].mon, t[lang].tue, t[lang].wed, t[lang].thu, t[lang].fri, t[lang].sat, t[lang].sun];
  const weeklyBookings = [3, 4, 6, 2, 5, 8, 3];

  const tables = [1, 2, 3, 4, 5];
  const tableCount = tables.map(
    (tblId) => bookings.filter((b) => Number(b.table) === tblId).length
  );

  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";

  const text = isDark ? "#e6eef8" : "#0f172a";
  const grid = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const glow = isDark ? "rgba(78,163,255,0.9)" : "rgba(17,82,255,0.9)";
  const fill = isDark
    ? "rgba(78,163,255,0.22)"
    : "rgba(17,82,255,0.22)";

  const baseOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 20, bottom: 10 } },
      plugins: {
        legend: { display: false }, // ❗统一隐藏 legend
        tooltip: {
          backgroundColor: isDark
            ? "rgba(30,41,59,0.93)"
            : "rgba(255,255,255,0.97)",
          titleColor: text,
          bodyColor: text,
          borderColor: grid,
          borderWidth: 1,
          padding: 12,
          displayColors: false,
        },
      },
      animation: {
        duration: 900,
        easing: "cubic-bezier(.16,.84,.44,1)",
      },
      scales: {
        x: {
          ticks: { color: text, font: { weight: 600 } },
          grid: { color: "transparent" },
        },
        y: {
          ticks: { color: text, font: { weight: 600 } },
          grid: { color: grid },
        },
      },
    }),
    [text, grid, isDark]
  );

  const lineData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: t[lang].weeklyBookings,
        data: weeklyBookings,
        borderColor: glow,
        backgroundColor: fill,
        borderWidth: 3,
        tension: 0.45,
        pointRadius: 5,
        pointBackgroundColor: glow,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: tables.map((tblId) => `${t[lang].table} ${tblId}`),
    datasets: [
      {
        label: t[lang].tableUsage,
        data: tableCount,
        backgroundColor: glow,
        borderRadius: 14,
      },
    ],
  };

  const pieData = {
    labels: tables.map((tblId) => `${t[lang].table} ${tblId}`),
    datasets: [
      {
        data: tableCount,
        backgroundColor: [
          "rgba(78,163,255,0.9)",
          "rgba(255,159,64,0.9)",
          "rgba(75,192,192,0.9)",
          "rgba(153,102,255,0.9)",
          "rgba(255,205,86,0.9)",
        ],
        hoverOffset: 14,
      },
    ],
  };

  return (
    <div className="charts-grid">

      {/* LINE */}
      <div className="card chart-card">
        <h3 className="chart-title">{t[lang].weeklyBookings}</h3>
        <Line data={lineData} options={baseOptions} />
      </div>

      {/* BAR */}
      <div className="card chart-card">
        <h3 className="chart-title">{t[lang].tableUsage}</h3>
        <Bar data={barData} options={baseOptions} />
      </div>

      {/* PIE */}
      <div className="card chart-card">
        <h3 className="chart-title">{t[lang].tableDistribution}</h3>

        {/* ⭐ 自定义横向 legend —— 永不换行 */}
        <div className="custom-legend">
          <div><span className="legend-box" style={{ background: "#4ea3ff" }}></span> {t[lang].table} 1</div>
          <div><span className="legend-box" style={{ background: "#ff9f40" }}></span> {t[lang].table} 2</div>
          <div><span className="legend-box" style={{ background: "#4bc0c0" }}></span> {t[lang].table} 3</div>
          <div><span className="legend-box" style={{ background: "#9966ff" }}></span> {t[lang].table} 4</div>
          <div><span className="legend-box" style={{ background: "#ffcd56" }}></span> {t[lang].table} 5</div>
        </div>

        <div style={{ height: '220px' }}>
          <Pie data={pieData} options={{ 
            animation: baseOptions.animation, 
            plugins: { legend: false },
            maintainAspectRatio: true,
            responsive: true
          }} />
        </div>
      </div>

    </div>
  );
}
