const express = require("express");
const router = express.Router();

const Table = require("../models/Table");

/* -----------------------------
   GET ALL TABLES
------------------------------ */
router.get("/", (req, res) => {
  Table.find()
    .then(tables => res.json(tables))
    .catch(err => res.status(500).json({ error: "Failed to read tables" }));
});

/* -----------------------------
   ADD NEW TABLE
   Accepts { number, capacity } (number optional -> auto id)
------------------------------ */
router.post("/", (req, res) => {
  const { number, capacity } = req.body;
  let id = number !== undefined ? Number(number) : null;
  const cap = capacity ? Number(capacity) : 4;
  (async () => {
    if (id) {
      const exists = await Table.findOne({ id });
      if (exists) return res.status(400).json({ error: "Table already exists" });
    } else {
      // Auto-increment id
      const last = await Table.findOne().sort({ id: -1 });
      id = last ? last.id + 1 : 1;
    }
    const newTable = new Table({ id, capacity: cap });
    await newTable.save();
    const tables = await Table.find().sort({ id: 1 });
    res.json(tables);
  })();
});

/* -----------------------------
   DELETE TABLE
------------------------------ */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  (async () => {
    const exists = await Table.findOne({ id });
    if (!exists) return res.status(404).json({ error: "Table not found" });
    await Table.deleteOne({ id });
    const tables = await Table.find().sort({ id: 1 });
    res.json(tables);
  })();
});

module.exports = router;
