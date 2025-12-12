import React, { useEffect, useState } from "react";

export default function Tables({ bookings, tables = [], lang = 'en' }) {
  const t = {
    en: {
      table: "Table",
      seats: "seats",
      occupied: "Occupied",
      available: "Available"
    },
    zh: {
      table: "餐桌",
      seats: "个座位",
      occupied: "占用",
      available: "可用"
    }
  };

  // ⭐ 判断桌子是否有人
  const isOccupied = (id) =>
    (bookings || []).some((b) => Number(b.table) === Number(id));

  // Sort tables numerically
  const sortedTables = [...(tables || [])].sort((a, b) => {
    const idA = typeof a === 'object' ? a.id : a;
    const idB = typeof b === 'object' ? b.id : b;
    return Number(idA) - Number(idB);
  });

  return (
    <div className="table-grid">
      {sortedTables.map((tbl) => {
        const tableId = typeof tbl === 'object' ? tbl.id : tbl;
        const capacity = typeof tbl === 'object' ? tbl.capacity : 4;

        return (
          <div
            key={tableId}
            className={`table-card ${isOccupied(tableId) ? "occupied" : "available"}`}
          >
            <h3>{t[lang].table} {tableId}</h3>
            <p>{capacity} {t[lang].seats}</p>

            <span className="table-status">
              {isOccupied(tableId) ? t[lang].occupied : t[lang].available}
            </span>
          </div>
        );
      })}
    </div>
  );
}
