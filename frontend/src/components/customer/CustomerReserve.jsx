import React, { useState, useEffect } from "react";
import { createBooking, getTables } from "../../api";
import "../../customer.css";

export default function CustomerReserve({ setToast, setPage, selectedTable }) {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    getTables().then((res) => setTables(res.data || []));
  }, []);

  const [form, setForm] = useState({
    name: "",
    people: "",
    table: selectedTable || "",
    time: "",
    phone: "",
  });
  const [assignedTable, setAssignedTable] = useState(null);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.people || !form.time) {
      setToast("请填写所有字段！");
      return;
    }

    try {
      const payload = {
        name: form.name,
        people: form.people,
        time: form.time,
        ...(form.table && { table: form.table }),
        ...(form.phone && { phone: form.phone })
      };
      const res = await createBooking(payload);
      const tableId = res.data?.table;
      setAssignedTable(tableId);
      setToast(tableId ? `预约成功！已为您分配餐桌 ${tableId}` : "预约成功！");
      setTimeout(() => {
        setPage("customer");
      }, 2000);
    } catch (err) {
      setToast(err.response?.data?.error || "预约失败");
    }
  };

  return (
    <div className="cust-container fade-in">
      <h1 className="cust-title">餐桌预约</h1>

      <div className="cust-form-box">
        
        {/* NAME */}
        <div className="cust-field">
          <label>姓名</label>
          <input
            className="cust-input"
            name="name"
            value={form.name}
            onChange={change}
          />
        </div>

        {/* PHONE */}
        <div className="cust-field">
          <label>手机号码（可选）</label>
          <input
            className="cust-input"
            name="phone"
            placeholder="请输入手机号码"
            value={form.phone}
            onChange={change}
          />
        </div>

        {/* PEOPLE */}
        <div className="cust-field">
          <label>人数</label>
          <input
            className="cust-input"
            name="people"
            type="number"
            value={form.people}
            onChange={change}
          />
        </div>

        {/* TABLE (动态) */}
        <div className="cust-field">
          <label>餐桌编号（可选）</label>
          <select
            className="cust-input"
            name="table"
            value={form.table}
            onChange={change}
          >
            <option value="">自动分配最合适的餐桌</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                餐桌 {t.id} ({t.capacity}人座)
              </option>
            ))}
          </select>

          {selectedTable && (
            <div className="cust-tip">（已为你自动选择餐桌 {selectedTable}）</div>
          )}
        </div>

        {/* TIME */}
        <div className="cust-field">
          <label>时间段</label>
          <select
            className="cust-input"
            name="time"
            value={form.time}
            onChange={change}
          >
            <option value="">请选择时间段</option>
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

        <button className="cust-primary-btn" onClick={submit}>
          确认预约
        </button>

        {/* SUCCESS MESSAGE */}
        {assignedTable && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', fontSize: '16px', color: '#2e7d32', textAlign: 'center' }}>
            ✓ 已为您分配餐桌 {assignedTable}
          </div>
        )}

      </div>
    </div>
  );
}
