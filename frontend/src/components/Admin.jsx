import React, { useEffect, useState } from "react";
import { getBookings, cancelBooking, updateBooking } from "../api";
import ConfirmDialog from "./ConfirmDialog";
import EditDialog from "./EditDialog";

export default function Admin({ setToast, lang = 'en' }) {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [editData, setEditData] = useState(null);

  // Load bookings
  const load = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch (err) {
      console.log("Error loading bookings", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Search filter
  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      String(b.table).includes(q) ||
      b.time.toLowerCase().includes(q)
    );
  });

  // Cancel booking
  const handleCancel = async (id) => {
    await cancelBooking(id);
    setToast("Booking canceled!");
    load();
  };

  const t = {
    en: {
      reservationList: "Reservation List",
      searchPlaceholder: "Search bookings...",
      noMatch: "No matching reservations.",
      people: "people",
      table: "Table",
      noPhone: "No phone",
      noDate: "No date",
      edit: "Edit",
      cancel: "Cancel",
      bookingUpdated: "Booking updated!",
      bookingCanceled: "Booking canceled!"
    },
    zh: {
      reservationList: "預約列表",
      searchPlaceholder: "搜尋預約...",
      noMatch: "沒有符合的預約。",
      people: "人",
      table: "餐桌",
      noPhone: "沒有電話",
      noDate: "沒有日期",
      edit: "編輯",
      cancel: "取消",
      bookingUpdated: "預約已更新！",
      bookingCanceled: "預約已取消！"
    }
  };

  return (
    <div className="fade-in">
      <h2>{t[lang].reservationList}</h2>

      {/* Search bar (beautiful version) */}
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t[lang].searchPlaceholder}
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="empty">{t[lang].noMatch}</p>
      )}

      {/* Booking list */}
      {filtered.map((b) => (
        <div className="booking-card" key={b.id} style={{ position: 'relative' }}>
          <div className="booking-info">
            <span className="booking-name">{b.name}</span>
            <span className="booking-meta">
              {b.people} {t[lang].people} • {t[lang].table} {b.table}
            </span>
            <span className="booking-meta">{b.time}</span>
            <span className="booking-meta">
              📞 {b.phone || t[lang].noPhone}
            </span>
            <span className="booking-meta">
              📅 {b.date || t[lang].noDate}
            </span>
          </div>

          <div className="booking-actions">
            <button className="mini-btn" onClick={() => setEditData(b)}>
              {t[lang].edit}
            </button>

            <button className="danger-btn" onClick={() => setConfirmId(b.id)}>
              {t[lang].cancel}
            </button>
          </div>

          {/* Show confirm dialog inline for this specific booking */}
          {confirmId === b.id && (
            <ConfirmDialog
              lang={lang}
              onCancel={() => setConfirmId(null)}
              onConfirm={() => {
                handleCancel(confirmId);
                setConfirmId(null);
                setToast(t[lang].bookingCanceled);
              }}
            />
          )}

          {/* Show edit dialog inline for this specific booking */}
          {editData && editData.id === b.id && (
            <EditDialog
              lang={lang}
              data={editData}
              onCancel={() => setEditData(null)}
              onSave={async (newData) => {
                await updateBooking(editData.id, newData);
                setToast(t[lang].bookingUpdated);
                setEditData(null);
                load();
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
