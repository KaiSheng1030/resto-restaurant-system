import React, { useState } from "react";

export default function EditDialog({ data, onCancel, onSave }) {
  const [name, setName] = useState(data.name);
  const [people, setPeople] = useState(data.people);
  const [time, setTime] = useState(data.time);
  const [table, setTable] = useState(data.table);

  return (
    <div className="dialog-overlay fade-in">
      <div className="dialog-box edit-dialog fade-in">

        <h2 className="dialog-title">Edit Booking</h2>

        <div className="dialog-grid">
          <input
            className="dialog-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer Name"
          />

          <input
            className="dialog-input"
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="People"
          />

          <input
            className="dialog-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="YYYY-MM-DD HH:mm"
          />

          <input
            className="dialog-input"
            type="number"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            placeholder="Table No."
          />
        </div>

        <div className="dialog-buttons-2">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>

          <button
            className="save-btn"
            onClick={() =>
              onSave({ name, people, time, table })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
