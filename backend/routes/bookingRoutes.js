const express = require("express");
const router = express.Router();

let bookings = []; // 简易数据库

/* ---- CREATE (WITH DUPLICATE CHECK) ---- */
router.post("/", (req, res) => {
  const { name, people, table, time } = req.body;

  if (!name || !people || !table || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ❗ 防止重复预约 (同桌 + 同时间)
  const exists = bookings.some(
    (b) => Number(b.table) === Number(table) && b.time === time
  );

  if (exists) {
    return res.status(400).json({
      error: "This time slot is already booked for this table.",
    });
  }

  const newBooking = {
    id: Date.now(),
    name,
    people,
    table,
    time,
  };

  bookings.push(newBooking);
  res.json(newBooking);
});

/* ---- READ ALL ---- */
router.get("/", (req, res) => {
  res.json(bookings);
});

/* ---- READ BY TABLE (for CustomerTablePage) ---- */
router.get("/table/:id", (req, res) => {
  const tableId = Number(req.params.id);
  const filtered = bookings.filter((b) => Number(b.table) === tableId);
  res.json(filtered);
});

/* ---- UPDATE ---- */
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).send("Booking not found");
  }

  // ❗ 编辑时也要防重复 (同桌 + 同时间)
  if (req.body.table || req.body.time) {
    const table = req.body.table || bookings[index].table;
    const time = req.body.time || bookings[index].time;

    const exists = bookings.some(
      (b) =>
        b.id !== id &&
        Number(b.table) === Number(table) &&
        b.time === time
    );

    if (exists) {
      return res.status(400).json({
        error: "This time slot is already booked for this table.",
      });
    }
  }

  bookings[index] = { ...bookings[index], ...req.body };
  res.json(bookings[index]);
});

/* ---- DELETE ---- */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  bookings = bookings.filter((b) => b.id !== id);
  res.json({ success: true });
});

/* ---- EXPORT ---- */
module.exports = router;
