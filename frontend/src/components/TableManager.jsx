
import React, { useEffect, useState } from "react";
import { getTables, addTable, deleteTable } from "../api";
import ConfirmDialog from "./ConfirmDialog";
import "./TablesManager.css";

export default function TablesManager() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState("");

  const load = async () => {
    try {
      const res = await getTables();
      setTables(res.data || []);
      localStorage.setItem("tables", JSON.stringify(res.data || []));
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!newTable) return;
    try {
      await addTable(newTable);
      setNewTable("");
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Add failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTable(id);
    } catch (err) {
      console.error("Delete table error:", err);
      alert(err?.response?.data?.error || "Delete failed");
    } finally {
      load();
    }
  };

  return (
    <div className="table-manager">
      <h3 className="tm-title">Table Manager</h3>

      <div className="tm-list">
        {tables.map((t) => {
          const tableId = typeof t === 'object' ? t.id : t;
          const capacity = typeof t === 'object' ? t.capacity : 4;
          return (
            <div className="tm-row" key={tableId}>
              <div className="tm-info">
                <span className="tm-table-number">Table {tableId}</span>
                <span className="tm-capacity">{capacity} seats</span>
              </div>
              <button className="tm-delete" onClick={() => handleDelete(tableId)}>
                <span>🗑️</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="tm-add-box">
        <input
          return (
            <div className="table-manager">
              <h3 className="tm-title">Table Manager</h3>

              <div className="tm-list">
                {tables.map((t) => {
                  const tableId = typeof t === 'object' ? t.id : t;
                  const capacity = typeof t === 'object' ? t.capacity : 4;
                  return (
                    <div className="tm-row" key={tableId}>
                      <div className="tm-info">
                        <span className="tm-table-number">Table {tableId}</span>
                        <span className="tm-capacity">{capacity} seats</span>
                      </div>
                      <button className="tm-delete" onClick={() => handleDelete(tableId)}>
                        <span>🗑️</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="tm-add">
                <input
                  type="number"
                  min="1"
                  placeholder="Table Number"
                  value={newTable}
                  onChange={e => setNewTable(e.target.value)}
                />
                <button className="tm-add-btn" onClick={handleAdd}>Add Table</button>
              </div>
            </div>
          );
