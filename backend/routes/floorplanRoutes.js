const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const layoutPath = path.join(__dirname, "../floorplan-layout.json");

// GET /api/floorplan/layout - Get saved floor plan layout
router.get("/layout", (req, res) => {
  try {
    if (fs.existsSync(layoutPath)) {
      const data = fs.readFileSync(layoutPath, "utf-8");
      const layout = JSON.parse(data);
      res.json(layout);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error("Error reading floor plan layout:", err);
    res.status(500).json({ error: "Failed to read floor plan layout" });
  }
});

// POST /api/floorplan/layout - Save floor plan layout
router.post("/layout", (req, res) => {
  try {
    const layout = req.body;
    fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2));
    res.json({ message: "Floor plan layout saved successfully", layout });
  } catch (err) {
    console.error("Error saving floor plan layout:", err);
    res.status(500).json({ error: "Failed to save floor plan layout" });
  }
});

module.exports = router;
