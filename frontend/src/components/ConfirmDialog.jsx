import React from "react";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ message, onConfirm, onCancel, lang = 'en', style = {} }) {
    const t = {
      en: {
        title: "Confirm cancellation",
        no: "No",
        yes: "Yes, cancel"
      },
      zh: {
        title: "确认取消",
        no: "否",
        yes: "是，取消"
      }
    };
  return (
    <>
      {/* Backdrop - click to close */}
      <div 
        className="confirm-backdrop" 
        onClick={onCancel}
      />
      
      <div className="confirm-inline-box" style={style} onClick={(e) => e.stopPropagation()}>
      <h4 className="confirm-inline-title">{t[lang].title}</h4>

      <p className="confirm-inline-msg">{message}</p>

      <div className="confirm-inline-btns">
        <button className="confirm-inline-no" onClick={onCancel}>
            {t[lang].no}
          </button>
          <button className="confirm-inline-yes" onClick={onConfirm}>
            {t[lang].yes}
          </button>
      </div>
    </div>
    </>
  );
}
