const express = require("express");
const router = express.Router();

// Temporary in-memory table storage
let tables = [1, 2, 3, 4, 5];

/* -----------------------------
   GET ALL TABLES
------------------------------ */
router.get("/", (req, res) => {
  res.json(tables);
});

/* -----------------------------
   ADD NEW TABLE
------------------------------ */
router.post("/", (req, res) => {
  const { number } = req.body;
  const num = Number(number);

  if (!num) return res.status(400).json({ error: "Invalid table number" });

  if (tables.includes(num))
    return res.status(400).json({ error: "Table already exists" });

  tables.push(num);
  tables.sort((a, b) => a - b);

  res.json(tables);
});

/* -----------------------------
   DELETE TABLE
------------------------------ */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  tables = tables.filter((t) => t !== id);

  res.json(tables);
});

module.exports = router;
