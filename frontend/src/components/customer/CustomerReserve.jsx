import React, { useState, useEffect } from "react";
import { createBooking } from "../../api";
import "../../customer.css";

export default function CustomerReserve({ setToast, setPage, selectedTable }) {

  const [form, setForm] = useState({
    name: "",
    people: "",
    table: selectedTable || "",
    time: "",
  });

  // 如果从某张桌子点击 “预约” → 自动填入 table
  useEffect(() => {
    if (selectedTable) {
      setForm((f) => ({ ...f, table: selectedTable }));
    }
  }, [selectedTable]);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.people || !form.table || !form.time) {
      setToast("请填写所有字段！");
      return;
    }

    try {
      await createBooking(form);
      setToast("预约成功！");
      setPage("customer");
    } catch (err) {
      // ⭐ 捕捉后端返回的错误信息
      setToast(err.response?.data?.error || "预约失败，请稍后再试");
    }
  };

  return (
    <div className="cust-container fade-in">

      <h1 className="cust-title">餐桌预约</h1>
      <p className="cust-subtitle">填写资料完成您的预订</p>

      <div className="cust-form-box">

        {/* NAME */}
        <div className="cust-field">
          <label>姓名</label>
          <input
            className="cust-input"
            name="name"
            placeholder="请输入姓名"
            value={form.name}
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
            placeholder="例如：2"
            value={form.people}
            onChange={change}
          />
        </div>

        {/* TABLE */}
        <div className="cust-field">
          <label>餐桌编号</label>
          <select
            className="cust-input"
            name="table"
            value={form.table}
            onChange={change}
          >
            <option value="">请选择</option>
            <option value="1">餐桌 1</option>
            <option value="2">餐桌 2</option>
            <option value="3">餐桌 3</option>
            <option value="4">餐桌 4</option>
            <option value="5">餐桌 5</option>
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

        {/* BUTTON */}
        <button className="cust-primary-btn" onClick={submit}>
          确认预约
        </button>

      </div>
    </div>
  );
}
