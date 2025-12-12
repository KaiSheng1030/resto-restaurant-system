import React from "react";
import "../../customer.css";

export default function MiniBack({ onBack, lang = 'en' }) {
  const t = {
    en: { back: "Back" },
    zh: { back: "返回" }
  };

  return (
    <div className="mini-back" onClick={onBack}>
      <span className="mini-arrow">‹</span> {t[lang].back}
    </div>
  );
}
