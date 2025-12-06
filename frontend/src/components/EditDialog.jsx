import React, { useState } from "react";
import "./EditDialog.css";

export default function EditDialog({ data, onCancel, onSave, lang = 'en' }) {
    const t = {
      en: {
        editReservation: "Edit Reservation",
        name: "Name",
        phone: "Phone",
        date: "Date",
        people: "People",
        table: "Table",
        time: "Time",
        cancel: "Cancel",
        save: "Save"
      },
      zh: {
        editReservation: "编辑预订",
        name: "姓名",
        phone: "电话",
        date: "日期",
        people: "人数",
        table: "桌号",
        time: "时间",
        cancel: "取消",
        save: "保存"
      }
    };
  const [name, setName] = useState(data.name);
  const [phone, setPhone] = useState(data.phone || "");
  const [people, setPeople] = useState(data.people);
  const [table, setTable] = useState(data.table);
  const [time, setTime] = useState(data.time);
  const [date, setDate] = useState(data.date || "");

  return (
    <>
      {/* Backdrop - click to close */}
      <div 
        className="edit-backdrop" 
        onClick={onCancel}
      />
      
      <div className="edit-inline-box" onClick={(e) => e.stopPropagation()}>
      <h4 className="edit-inline-title">{t[lang].editReservation}</h4>

      <div className="edit-inline-field">
        <label>{t[lang].name}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="edit-inline-field">
        <label>{t[lang].phone}</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="edit-inline-field">
        <label>{t[lang].date}</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
      </div>

      <div className="edit-inline-field">
        <label>{t[lang].people}</label>
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        />
      </div>

      <div className="edit-inline-field">
        <label>{t[lang].table}</label>
        <input
          type="number"
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
      </div>

      <div className="edit-inline-field">
        <label>{t[lang].time}</label>
        <input
          list="timeSlots"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <datalist id="timeSlots">
          {[
            "10:00 - 11:00",
            "11:00 - 12:00",
            "12:00 - 13:00",
            "13:00 - 14:00",
            "14:00 - 15:00",
            "15:00 - 16:00",
            "16:00 - 17:00",
            "17:00 - 18:00",
            "18:00 - 19:00",
            "19:00 - 20:00",
            "20:00 - 21:00",
            "21:00 - 22:00",
          ].map((slot) => (
            <option key={slot} value={slot} />
          ))}
        </datalist>
      </div>

      <div className="edit-inline-btns">
        <button className="edit-inline-cancel" onClick={onCancel}>
          {t[lang].cancel}
        </button>
        <button
          className="edit-inline-save"
          onClick={() =>
            onSave({ name, phone, people, table, time, date })
          }
        >
          {t[lang].save}
        </button>
      </div>
    </div>
    </>
  );
}
