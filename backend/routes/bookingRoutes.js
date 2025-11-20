const express = require("express");
const router = express.Router();

let bookings = []; // 简易数据库

/* ---- CREATE ---- */
router.post("/", (req, res) => {
  const newBooking = {
    id: Date.now(),
    ...req.body,
  };
  bookings.push(newBooking);
  res.json(newBooking);
});

/* ---- READ ---- */
router.get("/", (req, res) => {
  res.json(bookings);
});

/* ---- UPDATE (EDIT BOOKING) ---- */
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) return res.status(404).send("Booking not found");

  bookings[index] = { ...bookings[index], ...req.body };

  res.json(bookings[index]);
});

/* ---- DELETE ---- */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  bookings = bookings.filter((b) => b.id !== id);
  res.json({ success: true });
});

module.exports = router;

router.get("/table/:id", (req, res) => {
  const tableId = Number(req.params.id);

  const filtered = bookings.filter(
    (b) => Number(b.table) === tableId
  );

  res.json(filtered);
});
