const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const bookingsPath = path.join(__dirname, "../bookings.json");
const tablesPath = path.join(__dirname, "../tables.json");

function loadBookings() {
  try {
    return JSON.parse(fs.readFileSync(bookingsPath, "utf8"));
  } catch (e) {
    return [];
  }
}

function saveBookings(data) {
  fs.writeFileSync(bookingsPath, JSON.stringify(data, null, 2));
}

let bookings = loadBookings();

function loadTables() {
  try {
    return JSON.parse(fs.readFileSync(tablesPath, "utf8"));
  } catch (e) {
    return [];
  }
}

/* ---- CREATE (AUTO-ASSIGN TABLE IF OMITTED) ---- */
router.post("/", (req, res) => {
  const { name, people, table, time, phone } = req.body;

  if (!name || !people || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const peopleNum = Number(people);
  const timeStr = String(time);

  const tables = loadTables();

  let assignedTable = null;

  if (table !== undefined && table !== null && String(table).trim() !== "") {
    // Client asked for a specific table -> validate
    assignedTable = Number(table);
    const t = tables.find((tt) => tt.id === assignedTable);
    if (!t) return res.status(400).json({ error: "Table not found" });
    if (t.capacity < peopleNum)
      return res.status(400).json({ error: "Table capacity too small" });

    const conflict = bookings.some(
      (b) => Number(b.table) === assignedTable && b.time === timeStr
    );
    if (conflict) {
      return res.status(400).json({ error: "This time slot is already booked for this table." });
    }
  } else {
    // Auto-assign: pick smallest capacity >= people and not booked at the time
    const occupiedAtTime = bookings.filter((b) => b.time === timeStr).map((b) => Number(b.table));
    const candidates = tables
      .filter((t) => t.capacity >= peopleNum && !occupiedAtTime.includes(t.id))
      .sort((a, b) => a.capacity - b.capacity || a.id - b.id);

    if (candidates.length === 0) {
      return res.status(400).json({ error: "No available table for that party size and time." });
    }

    assignedTable = candidates[0].id;
  }

  const newBooking = {
    id: Date.now(),
    name,
    people: peopleNum,
    table: assignedTable,
    time: timeStr,
    ...(phone && { phone })
  };

  bookings.push(newBooking);
  saveBookings(bookings);
  res.json(newBooking);
});

/* ---- READ ALL ---- */
router.get("/", (req, res) => {
  res.json(bookings);
});

/* ---- READ BY TABLE ---- */
router.get("/table/:id", (req, res) => {
  const tableId = Number(req.params.id);
  const filtered = bookings.filter((b) => Number(b.table) === tableId);
  res.json(filtered);
});

/* ---- UPDATE ---- */
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) return res.status(404).json({ error: "Booking not found" });

  const current = bookings[index];
  const tables = loadTables();

  const newPeople = req.body.people !== undefined ? Number(req.body.people) : Number(current.people);
  const newTime = req.body.time !== undefined ? String(req.body.time) : current.time;
  const newTable = req.body.table !== undefined ? Number(req.body.table) : Number(current.table);

  const t = tables.find((tt) => tt.id === newTable);
  if (!t) return res.status(400).json({ error: "Table not found" });
  if (t.capacity < newPeople) return res.status(400).json({ error: "Table capacity too small" });

  const conflict = bookings.some(
    (b) => b.id !== id && Number(b.table) === newTable && b.time === newTime
  );
  if (conflict) {
    return res.status(400).json({ error: "This time slot is already booked for this table." });
  }

  bookings[index] = { ...current, ...req.body, people: newPeople, table: newTable, time: newTime };
  saveBookings(bookings);
  res.json(bookings[index]);
});

/* ---- DELETE ---- */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  bookings = bookings.filter((b) => b.id !== id);
  saveBookings(bookings);
  res.json({ success: true });
});

module.exports = router;
