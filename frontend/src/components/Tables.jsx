import React, { useEffect, useState } from "react";
import { getTables } from "../api";

export default function Tables({ bookings }) {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    let mounted = true;
    getTables()
      .then((res) => {
        if (!mounted) return;
        setTables(res.data || []);
      })
      .catch(() => {
        // fallback to defaults
        if (!mounted) return;
        setTables([
          { id: 1, capacity: 2, available: true },
          { id: 2, capacity: 4, available: true },
          { id: 3, capacity: 4, available: true },
          { id: 4, capacity: 6, available: true },
          { id: 5, capacity: 2, available: true },
        ]);
      });

    return () => (mounted = false);
  }, []);

  const isOccupied = (id) => (bookings || []).some((b) => Number(b.table) === Number(id));

  return (
    <div className="table-grid">
      {tables.map((t) => {
        const id = t.id;
        const capacity = t.capacity || 4;
        const occupied = isOccupied(id);
        const statusText = occupied ? "Occupied" : "Available";

        return (
          <div key={id} className={`table-card ${occupied ? "occupied" : "available"}`}>
            <h3>Table {id}</h3>
            <p>{capacity} seats</p>
            <span className="table-status">{statusText}</span>
          </div>
        );
      })}
    </div>
  );
}
