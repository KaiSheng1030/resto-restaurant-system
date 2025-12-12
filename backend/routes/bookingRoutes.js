const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
// For table auto-assign, we still need to read tables.json for now (unless you want to migrate tables too)
const fs = require("fs");
const path = require("path");
const tablesPath = path.join(__dirname, "..", "tables.json");
const loadTables = () => {
  try {
    return JSON.parse(fs.readFileSync(tablesPath, "utf8"));
  } catch {
    return [];
  }
};
// Helper: parse time slot string to end time (24h)
function getEndTime(timeSlot) {
  if (!timeSlot) return null;
  const parts = timeSlot.split("-");
  if (parts.length !== 2) return null;
  return parts[1].trim();
}

/* ----------------- CREATE BOOKING ----------------- */
router.post("/", async (req, res) => {
  let { name, people, table, time, phone, date } = req.body;
  if (!name || !people || !time || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!table) {
    const tables = loadTables();
    const peopleNum = Number(people);
    // Get occupied tables at this time
    const occupiedAtTime = await Booking.find({ time, date }).select("table");
    const occupiedIds = occupiedAtTime.map(b => Number(b.table));
    // Find suitable table
    const availableTables = tables
      .filter((tbl) => {
        const capacity = tbl.capacity || 4;
        return capacity >= peopleNum && !occupiedIds.includes(tbl.id);
      })
      .sort((a, b) => {
        const capA = a.capacity || 4;
        const capB = b.capacity || 4;
        return capA - capB || a.id - b.id;
      });
    if (availableTables.length === 0) {
      return res.status(400).json({ error: "No available table for this time slot" });
    }
    table = availableTables[0].id;
  }
  // 检查重复预约
  const exists = await Booking.findOne({ table: Number(table), time, date });
  if (exists) {
    return res.status(400).json({ error: "This time slot is already booked for this table." });
  }
  const newBooking = new Booking({
    name,
    people: Number(people),
    table: Number(table),
    time,
    phone,
    date,
    status: "active"
  });
  await newBooking.save();
  res.json(newBooking);
});

/* ----------------- READ ALL ----------------- */
router.get("/", async (req, res) => {
  // Optionally, you can implement archiving logic here with MongoDB
  const bookings = await Booking.find({ status: { $ne: "archived" } });
  res.json(bookings);
});
/* ----------------- HISTORY ENDPOINT ----------------- */
router.get("/history", async (req, res) => {
  const history = await Booking.find({ $or: [ { status: "archived" }, { completed: true }, { cancelled: true } ] });
  res.json(history);
});

/* ----------------- READ BY TABLE ----------------- */
router.get("/table/:id", async (req, res) => {
  const tableId = Number(req.params.id);
  const filtered = await Booking.find({ table: tableId, status: { $ne: "cancelled" } });
  res.json(filtered);
});

/* ----------------- UPDATE BOOKING ----------------- */
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  // 时间冲突检查
  if (req.body.table || req.body.time) {
    const table = req.body.table || booking.table;
    const time = req.body.time || booking.time;
    const conflict = await Booking.findOne({
      _id: { $ne: id },
      table: Number(table),
      time
    });
    if (conflict) {
      return res.status(400).json({ error: "This time slot is already booked for this table." });
    }
  }
  Object.assign(booking, req.body);
  await booking.save();
  res.json(booking);
});

/* ----------------- DELETE ----------------- */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("Cancel request for booking ID:", id);
  if (!id || id === "undefined") {
    console.log("Invalid or missing booking ID");
    return res.status(400).json({ error: "Invalid or missing booking ID" });
  }
  let booking;
  try {
    booking = await Booking.findById(id);
  } catch (err) {
    console.log("Invalid booking ID format:", err);
    return res.status(400).json({ error: "Invalid booking ID format" });
  }
  if (booking) {
    booking.status = "cancelled";
    booking.cancelled = true;
    await booking.save();
    console.log("Booking cancelled successfully:", booking._id);
    return res.json({ success: true });
  } else {
    console.log("Booking not found for ID:", id);
    return res.status(404).json({ error: "Booking not found" });
  }
});

module.exports = router;
