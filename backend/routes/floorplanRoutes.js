const express = require("express");
const router = express.Router();
const Floorplan = require("../models/Floorplan");

// GET /api/floorplan - Get all floorplans
router.get("/", async (req, res) => {
  try {
    const data = await Floorplan.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get floorplans" });
  }
});

// GET /api/floorplan/layout - Get saved floor plan layout
router.get("/layout", (req, res) => {
  Floorplan.findOne()
    .then(doc => {
      if (doc && doc.layout) {
        res.json(doc.layout);
      } else {
        res.json({});
      }
    })
    .catch(err => {
      console.error("Error reading floor plan layout:", err);
      res.status(500).json({ error: "Failed to read floor plan layout" });
    });
});

// POST /api/floorplan/layout - Save floor plan layout
router.post("/layout", (req, res) => {
  const layout = req.body;
  (async () => {
    try {
      let doc = await Floorplan.findOne();
      if (!doc) {
        doc = new Floorplan({ id: 1, name: "Main", layout });
      } else {
        doc.layout = layout;
      }
      await doc.save();
      res.json({ message: "Floor plan layout saved successfully", layout });
    } catch (err) {
      console.error("Error saving floor plan layout:", err);
      res.status(500).json({ error: "Failed to save floor plan layout" });
    }
  })();
});
// DELETE /api/floorplan - Delete all floorplan data
router.delete("/", async (req, res) => {
  try {
    await Floorplan.deleteMany({});
    res.json({ message: "All floorplan data deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete floorplan data" });
  }
});

module.exports = router;
