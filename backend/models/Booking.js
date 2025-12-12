
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  people: Number,
  table: Number,
  time: String,
  date: String,
  status: String,
  cancelled: { type: Boolean, default: false }
});

module.exports = mongoose.model("Booking", bookingSchema);
