const Booking = require("../models/Booking");
const TableService = require("../services/TableService");

let bookings = [];

exports.create = (req, res) => {
  const { name, people, time } = req.body;

  const table = TableService.assignTable(people);
  if (!table) return res.status(400).json({ message: "No table available" });

  const newBooking = new Booking(Date.now(), name, people, time, table.id);
  bookings.push(newBooking);
  res.json(newBooking);
};

exports.list = (req, res) => {
  res.json(bookings);
};

exports.cancel = (req, res) => {
  bookings = bookings.filter((b) => b.id != req.params.id);
  res.json({ message: "Booking cancelled" });
};
