import React, { useState } from "react";

export default function TableManager({ tables, setTables }) {
  const [newTable, setNewTable] = useState("");

  const addTable = () => {
    if (!newTable) return;
    const num = Number(newTable);

    if (tables.includes(num)) {
      alert("This table already exists.");
      return;
    }

    setTables([...tables, num].sort((a, b) => a - b));
    setNewTable("");
  };

  const deleteTable = (id) => {
    if (window.confirm("Delete this table?")) {
      setTables(tables.filter((t) => t !== id));
    }
  };

  return (
    <div className="card" style={{ marginTop: "20px" }}>
      <h3>Table Manager</h3>

      {/* List of tables */}
      <div style={{ marginTop: "10px" }}>
        {tables.map((t) => (
          <div
            key={t}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <span>Table {t}</span>
            <button
              className="danger-btn"
              onClick={() => deleteTable(t)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add new table */}
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <input
          type="number"
          placeholder="New table number"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(0,0,0,0.15)",
            flex: 1,
          }}
        />

        <button className="btn-primary" onClick={addTable}>
          Add
        </button>
      </div>
    </div>
  );
}
