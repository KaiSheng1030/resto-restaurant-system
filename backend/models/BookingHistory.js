const mongoose = require("mongoose");

const bookingHistorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  people: Number,
  table: Number,
  time: String,
  phone: String,
  date: String
});

module.exports = mongoose.model("BookingHistory", bookingHistorySchema);
