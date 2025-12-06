import React, { useState, useEffect } from "react";
import { createBooking, getTables } from "../../api";
import "../../customer.css";
import MiniBack from "./MiniBack";

export default function CustomerReserve({
  setToast,
  setPage,
  selectedTable,
  lang = "en",
  userPhone,       // ⭐ 接收从登入传过来的手机号码
  setCustomerBookings,
}) {
  const t = {
    en: {
      title: "Table Reservation",
      name: "Name",
      phone: "Phone Number",
      people: "Number of People",
      date: "Date",
      tableNumber: "Table Number",
      selectTable: "Please Select",
      table: "Table",
      autoSelected: "(Automatically selected Table",
      timeSlot: "Time Slot",
      selectTime: "Please Select Time Slot",
      confirmBooking: "Confirm Booking",
      fillAllFields: "Please fill in all fields!",
      bookingSuccess: "Booking successful!",
      bookingFailed: "Booking failed",
      autoAssign: "Auto-assign best table",
      assignedTable: "Assigned Table",
      seats: "seats",
      tableCapacityNote: "Only tables with sufficient capacity are shown",
    },
    zh: {
      title: "餐桌预约",
      name: "姓名",
      phone: "手机号码",
      people: "人数",
      date: "日期",
      tableNumber: "餐桌编号",
      selectTable: "请选择",
      table: "餐桌",
      autoSelected: "（已为你自动选择餐桌",
      timeSlot: "时间段",
      selectTime: "请选择时间段",
      confirmBooking: "确认预约",
      fillAllFields: "请填写所有字段！",
      bookingSuccess: "预约成功！",
      bookingFailed: "预约失败",
      autoAssign: "自动分配最合适的餐桌",
      assignedTable: "已分配餐桌",
      seats: "个座位",
      tableCapacityNote: "仅显示容量足够的餐桌",
    },
  };

  const safeToast = setToast || ((msg) => console.log("[Toast]", msg));
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [assignedTable, setAssignedTable] = useState(null);
  const [recommendedTable, setRecommendedTable] = useState(null);

  useEffect(() => {
    getTables().then((res) => setTables(res.data || []));
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { getBookings } = await import("../../api");
        const res = await getBookings();
        setBookings(res.data || []);
      } catch (err) {
        console.log("Failed to load bookings");
      }
    };
    loadBookings();
  }, []);

  // ⭐ 自动填入 phone
  const [form, setForm] = useState({
    name: "",
    people: "",
    table: "",
    time: "",
    phone: userPhone || "",     // ⭐ 自动填入登入使用者手机号码
    date: "",
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Calculate recommended table
  useEffect(() => {
    if (form.people && form.time && tables.length > 0) {
      const peopleNum = Number(form.people);
      const timeStr = form.time;

      const occupiedAtTime = bookings
        .filter((b) => b.time === timeStr)
        .map((b) => Number(b.table));

      const candidates = tables
        .filter((tbl) => {
          const tableId = typeof tbl === "object" ? tbl.id : tbl;
          const capacity = typeof tbl === "object" ? tbl.capacity : 4;
          return capacity >= peopleNum && !occupiedAtTime.includes(tableId);
        })
        .sort((a, b) => {
          const capA = typeof a === "object" ? a.capacity : 4;
          const capB = typeof b === "object" ? b.capacity : 4;
          const idA = typeof a === "object" ? a.id : a;
          const idB = typeof b === "object" ? b.id : b;
          return capA - capB || idA - idB;
        });

      if (candidates.length > 0) {
        const best = candidates[0];
        const tableId = typeof best === "object" ? best.id : best;
        const capacity = typeof best === "object" ? best.capacity : 4;
        setRecommendedTable({ id: tableId, capacity });
      } else {
        setRecommendedTable(null);
      }
    } else {
      setRecommendedTable(null);
    }
  }, [form.people, form.time, tables, bookings]);

  const submit = async () => {

    if (!form.name || !form.people || !form.time || !form.date) {
      safeToast(t[lang].fillAllFields);
      return;
    }

    // Check if selected time slot is already in the past
    const now = new Date();
    const selectedDate = new Date(form.date);
    // Parse end time from time slot string (e.g., "12:00 - 13:00" => "13:00")
    const endTime = (form.time || "").split("-")[1]?.trim();
    if (endTime) {
      const [h, m] = endTime.split(":").map(Number);
      selectedDate.setHours(h, m, 0, 0);
      if (selectedDate < now) {
        safeToast(lang === "en" ? "The selected time is already past." : "所选时间已过。");
        return;
      }
    }

    try {
      const payload = {
        name: form.name,
        people: form.people,
        time: form.time,
        phone: form.phone,
        date: form.date,
      };
      if (form.table) payload.table = form.table;

      const res = await createBooking(payload);
      const table = res.data?.table;
      if (table) {
        setAssignedTable(table);
      }

      // Always reload bookings after reservation
      if (setCustomerBookings) {
        const { getBookings } = await import("../../api");
        const bookingsRes = await getBookings();
        // Normalize phone numbers for matching
        const normalizePhone = (phone) => (phone || "").replace(/\D/g, "");
        setCustomerBookings((bookingsRes.data || []).filter(b => normalizePhone(b.phone) === normalizePhone(form.phone)));
      }

      safeToast("✓ " + t[lang].bookingSuccess + (table ? ` - ${t[lang].assignedTable} ${table}` : ""));
      setTimeout(() => {
        safeToast(
          lang === "en"
            ? "To check your reservations, click the bell 🔔 button at the top right."
            : "如需查看您的预约，请点击右上角铃铛按钮 🔔。"
        );
        setPage("customer");
      }, 2000);
    } catch (err) {
      safeToast(err.response?.data?.error || t[lang].bookingFailed);
    }
  };

  return (
    <div className="cust-container fade-in">
      <MiniBack onBack={() => setPage("customer")} lang={lang} />

      <h1 className="cust-title">{t[lang].title}</h1>

      <div className="cust-form-box">
        {/* NAME */}
        <div className="cust-field">
          <label>{t[lang].name}</label>
          <input className="cust-input" name="name" value={form.name} onChange={change} />
        </div>

        {/* PHONE — now auto-filled */}
        <div className="cust-field">
          <label>{t[lang].phone}</label>
          <input
            className="cust-input"
            name="phone"
            value={form.phone}
            onChange={change}
          />
        </div>

        {/* PEOPLE */}
        <div className="cust-field">
          <label>{t[lang].people}</label>
          <input
            className="cust-input"
            name="people"
            type="number"
            value={form.people}
            onChange={change}
          />
        </div>

        {/* DATE */}
        <div className="cust-field">
          <label>{t[lang].date}</label>
          <input
            className="cust-input"
            name="date"
            type="date"
            value={form.date}
            onChange={change}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* TIME */}
        <div className="cust-field">
          <label>{t[lang].timeSlot}</label>
          <select className="cust-input" name="time" value={form.time} onChange={change}>
            <option value="">{t[lang].selectTime}</option>
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
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="cust-field">
          <label>{t[lang].tableNumber}</label>
          <select className="cust-input" name="table" value={form.table} onChange={change}>
            <option value="">{t[lang].autoAssign}</option>

            {tables.map((tbl) => {
              const tableId = typeof tbl === "object" ? tbl.id : tbl;
              const capacity = typeof tbl === "object" ? tbl.capacity : 4;
              const peopleNum = Number(form.people) || 0;

              if (peopleNum > 0 && capacity < peopleNum) return null;

              return (
                <option key={tableId} value={tableId}>
                  {t[lang].table} {tableId}
                </option>
              );
            })}
          </select>

          {form.people && Number(form.people) > 0 && (
            <div
              style={{
                marginTop: "6px",
                fontSize: "0.85em",
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              ℹ️ {t[lang].tableCapacityNote}
            </div>
          )}

          {recommendedTable && !form.table && (
            <div
              className="cust-tip"
              style={{
                marginTop: "8px",
                padding: "8px 12px",
                background: "#e7f3ff",
                border: "1px solid #b3d9ff",
                borderRadius: "6px",
                fontSize: "0.9em",
                color: "#0066cc",
              }}
            >
              ( {t[lang].autoAssign}: {t[lang].table} {recommendedTable.id} [ {recommendedTable.capacity} {t[lang].seats} ] )
            </div>
          )}
        </div>

        <button className="cust-primary-btn" onClick={submit}>
          {t[lang].confirmBooking}
        </button>
      </div>
    </div>
  );
}
