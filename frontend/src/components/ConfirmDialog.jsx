import React from "react";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Confirm cancellation</h3>
        <p>{message}</p>

        <div className="dialog-buttons">
          <button onClick={onCancel}>No</button>
          <button className="danger-btn" onClick={onConfirm}>
            Yes, cancel
          </button>
        </div>
      </div>
    </div>
  );
}
