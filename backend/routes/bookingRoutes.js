const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const bookingsPath = path.join(__dirname, "..", "bookings.json");
const tablesPath = path.join(__dirname, "..", "tables.json");
const historyPath = path.join(__dirname, "..", "booking-history.json");
// Load booking history from file
const loadHistory = () => {
  try {
    return JSON.parse(fs.readFileSync(historyPath, "utf8"));
  } catch {
    return [];
  }
};

// Save booking history to file
const saveHistory = (data) => {
  fs.writeFileSync(historyPath, JSON.stringify(data, null, 2));
};
// Helper: parse time slot string to end time (24h)
function getEndTime(timeSlot) {
  // e.g. "12:00 - 13:00" => "13:00"
  if (!timeSlot) return null;
  const parts = timeSlot.split("-");
  if (parts.length !== 2) return null;
  return parts[1].trim();
}

// Helper: check and archive expired bookings
function archiveExpiredBookings() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  let changed = false;
  let bookingsData = loadBookings();
  let historyData = loadHistory();
  const keep = [];
  for (const b of bookingsData) {
    // Only archive if date < today, or (date == today and end time < now)
    if (b.date < todayStr) {
      historyData.push({ ...b, completed: true });
      changed = true;
    } else if (b.date === todayStr) {
      const end = getEndTime(b.time);
      if (end) {
        const [h, m] = end.split(":").map(Number);
        const endDate = new Date(b.date + 'T' + end + ':00');
        if (now > endDate) {
          historyData.push({ ...b, completed: true });
          changed = true;
          continue;
        }
      }
      keep.push(b);
    } else {
      keep.push(b);
    }
  }
  if (changed) {
    saveBookings(keep);
    saveHistory(historyData);
    bookings = keep;
  }
}

// Load bookings from file
const loadBookings = () => {
  try {
    return JSON.parse(fs.readFileSync(bookingsPath, "utf8"));
  } catch {
    return [];
  }
};

// Load tables from file
const loadTables = () => {
  try {
    return JSON.parse(fs.readFileSync(tablesPath, "utf8"));
  } catch {
    return [];
  }
};

// Save bookings to file
const saveBookings = (data) => {
  fs.writeFileSync(bookingsPath, JSON.stringify(data, null, 2));
};

let bookings = loadBookings();

/* ----------------- CREATE BOOKING ----------------- */
router.post("/", (req, res) => {
  let { name, people, table, time, phone, date } = req.body;

  // ⭐ Validate required fields (table is optional for auto-assign)
  if (!name || !people || !time || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ⭐ Auto-assign table if not provided
  if (!table) {
    const tables = loadTables();
    const peopleNum = Number(people);
    
    // Get occupied tables at this time
    const occupiedAtTime = bookings
      .filter((b) => b.time === time && b.date === date)
      .map((b) => Number(b.table));

    // Find suitable table
    const availableTables = tables
      .filter((tbl) => {
        const capacity = tbl.capacity || 4;
        return capacity >= peopleNum && !occupiedAtTime.includes(tbl.id);
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
  const exists = bookings.some(
    (b) => Number(b.table) === Number(table) && b.time === time && b.date === date
  );

  if (exists) {
    return res.status(400).json({
      error: "This time slot is already booked for this table.",
    });
  }

  // ⭐ 必须保存 phone 和 date
  const newBooking = {
    id: Date.now(),
    name,
    people: Number(people),
    table: Number(table),
    time,
    phone,
    date,
  };

  bookings.push(newBooking);
  saveBookings(bookings);
  res.json(newBooking);
});

/* ----------------- READ ALL ----------------- */
router.get("/", (req, res) => {
  archiveExpiredBookings();
  res.json(bookings);
});
/* ----------------- HISTORY ENDPOINT ----------------- */
router.get("/history", (req, res) => {
  archiveExpiredBookings();
  res.json(loadHistory());
});

/* ----------------- READ BY TABLE ----------------- */
router.get("/table/:id", (req, res) => {
  const tableId = Number(req.params.id);
  const filtered = bookings.filter((b) => Number(b.table) === tableId);
  res.json(filtered);
});

/* ----------------- UPDATE BOOKING ----------------- */
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) return res.status(404).json({ error: "Booking not found" });

  // 时间冲突检查
  if (req.body.table || req.body.time) {
    const table = req.body.table || bookings[index].table;
    const time = req.body.time || bookings[index].time;

    const conflict = bookings.some(
      (b) =>
        b.id !== id &&
        Number(b.table) === Number(table) &&
        b.time === time
    );

    if (conflict) {
      return res
        .status(400)
        .json({ error: "This time slot is already booked for this table." });
    }
  }

  // ⭐ 更新 phone（你之前完全没更新）
  bookings[index] = { ...bookings[index], ...req.body };
  saveBookings(bookings);

  res.json(bookings[index]);
});

/* ----------------- DELETE ----------------- */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const toCancel = bookings.find((b) => b.id === id);
  if (toCancel) {
    // Mark as cancelled and move to history
    const historyData = loadHistory();
    historyData.push({ ...toCancel, cancelled: true });
    saveHistory(historyData);
  }
  bookings = bookings.filter((b) => b.id !== id);
  saveBookings(bookings);
  res.json({ success: true });
});

module.exports = router;
