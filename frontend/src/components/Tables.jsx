import React, { useEffect, useState } from "react";

export default function Tables({ bookings, lang = 'en' }) {
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

  const [tables, setTables] = useState([]);

  // ⭐ 从 localStorage 读取桌子列表
  useEffect(() => {
    const saved = localStorage.getItem("tables");
    if (saved) {
      setTables(JSON.parse(saved));  // 例如 [1,2,3,4,5,6]
    } else {
      setTables([1, 2, 3, 4, 5]); // 默认
    }
  }, []);

  // ⭐ 判断桌子是否有人
  const isOccupied = (id) =>
    (bookings || []).some((b) => Number(b.table) === Number(id));

  // ⭐ 默认容量（你之前设定）
  const defaultCap = {
    1: 2,
    2: 4,
    3: 4,
    4: 6,
    5: 2,
  };

  return (
    <div className="table-grid">
      {(tables || []).map((tbl) => {
        const tableId = typeof tbl === 'object' ? tbl.id : tbl;
        const capacity = typeof tbl === 'object' ? tbl.capacity : (defaultCap[tbl] || 4);

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
