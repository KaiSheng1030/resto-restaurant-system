const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  capacity: { type: Number, default: 4 }
});

module.exports = mongoose.model("Table", tableSchema);
