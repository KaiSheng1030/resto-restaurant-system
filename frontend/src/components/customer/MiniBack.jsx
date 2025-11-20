import React from "react";
import "../../customer.css";

export default function MiniBack({ onBack }) {
  return (
    <div className="mini-back" onClick={onBack}>
      <span className="mini-arrow">‹</span> 返回
    </div>
  );
}
