import React, { useEffect, useState } from "react";
import { getBookings, cancelBooking, updateBooking } from "../api";
import ConfirmDialog from "./ConfirmDialog";
import EditDialog from "./EditDialog";

export default function Admin({ setToast, lang = 'en' }) {
  const t = {
    en: {
      title: "Reservation List",
      searchPlaceholder: "Search bookings...",
      noMatching: "No matching reservations.",
      people: "people",
      table: "Table",
      edit: "Edit",
      cancel: "Cancel",
      bookingCanceled: "Booking canceled!",
      bookingUpdated: "Booking updated!"
    },
    zh: {
      title: "预订列表",
      searchPlaceholder: "搜索预订...",
      noMatching: "没有匹配的预订。",
      people: "人",
      table: "餐桌",
      edit: "编辑",
      cancel: "取消",
      bookingCanceled: "预订已取消！",
      bookingUpdated: "预订已更新！"
    }
  };

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
    setToast(t[lang].bookingCanceled);
    load();
  };

  return (
    <div className="fade-in">
      <h2>{t[lang].title}</h2>

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
        <p className="empty">{t[lang].noMatching}</p>
      )}

      {/* Booking list */}
      {filtered.map((b) => (
        <div className="booking-card" key={b.id}>
          <div className="booking-info">
            <span className="booking-name">{b.name}</span>
            <span className="booking-meta">
              {b.people} {t[lang].people} • {t[lang].table} {b.table}
            </span>
            <span className="booking-meta">{b.time}</span>
          </div>

          <div className="booking-actions">
            <button className="mini-btn" onClick={() => setEditData(b)}>
              {t[lang].edit}
            </button>

            <button className="danger-btn" onClick={() => setConfirmId(b.id)}>
              {t[lang].cancel}
            </button>
          </div>
        </div>
      ))}

      {/* Confirm delete dialog */}
      {confirmId && (
        <ConfirmDialog
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            handleCancel(confirmId);
            setConfirmId(null);
          }}
          lang={lang}
        />
      )}

      {/* Edit booking dialog */}
      {editData && (
        <EditDialog
          data={editData}
          onCancel={() => setEditData(null)}
          onSave={async (newData) => {
            await updateBooking(editData.id, newData);
            setToast(t[lang].bookingUpdated);
            setEditData(null);
            load();
          }}
          lang={lang}
        />
      )}
    </div>
  );
}
