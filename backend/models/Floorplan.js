const mongoose = require("mongoose");

const floorplanSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  layout: Object
});

module.exports = mongoose.model("Floorplan", floorplanSchema);
