import React, { useEffect, useState } from "react";

export default function Tables({ bookings }) {
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
    bookings.some((b) => Number(b.table) === Number(id));

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
      {tables.map((id) => {
        const capacity = defaultCap[id] || 4; // 新增桌子默认 4 座

        return (
          <div
            key={id}
            className={`table-card ${isOccupied(id) ? "occupied" : "available"}`}
          >
            <h3>Table {id}</h3>
            <p>{capacity} seats</p>

            <span className="table-status">
              {isOccupied(id) ? "Occupied" : "Available"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
