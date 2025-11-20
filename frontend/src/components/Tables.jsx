import React from "react";

const TABLES = [
  { id: 1, capacity: 2 },
  { id: 2, capacity: 4 },
  { id: 3, capacity: 4 },
  { id: 4, capacity: 6 },
  { id: 5, capacity: 2 }
];

export default function Tables({ bookings }) {
  return (
    <div className="table-grid">
      {TABLES.map((table) => {
        const occupied = bookings.some((b) => b.table === table.id);

        return (
          <div
            key={table.id}
            className={`table-card ${occupied ? "occupied" : "available"}`}
          >
            <h3>Table {table.id}</h3>
            <p>{table.capacity} seats</p>

            <span className="table-status">
              {occupied ? "Occupied" : "Available"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
