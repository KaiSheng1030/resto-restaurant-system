import React from "react";

export default function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Confirm cancellation</h3>
        <p>Are you sure you want to cancel this reservation?</p>
        <div className="dialog-buttons">
          <button onClick={onCancel}>No</button>
          <button className="danger-btn" onClick={onConfirm}>Yes, cancel</button>
        </div>
      </div>
    </div>
  );
}
