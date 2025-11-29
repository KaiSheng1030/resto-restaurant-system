const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const tablesPath = path.join(__dirname, "../tables.json");

function loadTables() {
  return JSON.parse(fs.readFileSync(tablesPath, "utf8"));
}

function saveTables(data) {
  fs.writeFileSync(tablesPath, JSON.stringify(data, null, 2));
}

/* -----------------------------
   GET ALL TABLES
------------------------------ */
router.get("/", (req, res) => {
  try {
    const tables = loadTables();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: "Failed to read tables" });
  }
});

/* -----------------------------
   ADD NEW TABLE
   Accepts { number, capacity } (number optional -> auto id)
------------------------------ */
router.post("/", (req, res) => {
  const { number, capacity } = req.body;
  let tables = loadTables();

  let id = number !== undefined ? Number(number) : null;
  if (id && tables.some(t => t.id === id)) {
    return res.status(400).json({ error: "Table already exists" });
  }

  if (!id) {
    id = (tables.reduce((m, t) => Math.max(m, t.id), 0) || 0) + 1;
  }

  const cap = capacity ? Number(capacity) : 4;
  const newTable = { id, capacity: cap, available: true };
  tables.push(newTable);
  tables.sort((a, b) => a.id - b.id);

  saveTables(tables);
  res.json(tables);
});

/* -----------------------------
   DELETE TABLE
------------------------------ */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  let tables = loadTables();

  if (!tables.some(t => t.id === id)) {
    return res.status(404).json({ error: "Table not found" });
  }

  tables = tables.filter((t) => t.id !== id);
  saveTables(tables);
  res.json(tables);
});

module.exports = router;
