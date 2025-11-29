import React from "react";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ message, onConfirm, onCancel, lang = 'en' }) {
  const t = {
    en: {
      title: "Confirm cancellation",
      no: "No",
      yesCancel: "Yes, cancel"
    },
    zh: {
      title: "确认取消",
      no: "否",
      yesCancel: "是的，取消"
    }
  };

  return (
    <div className="confirm-inline-box">
      <h4 className="confirm-inline-title">{t[lang].title}</h4>

      <p className="confirm-inline-msg">{message}</p>

      <div className="confirm-inline-btns">
        <button className="confirm-inline-no" onClick={onCancel}>
          {t[lang].no}
        </button>
        <button className="confirm-inline-yes" onClick={onConfirm}>
          {t[lang].yesCancel}
        </button>
      </div>
    </div>
  );
}
