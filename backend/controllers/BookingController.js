const Booking = require("../models/Booking");
const TableService = require("../services/TableService");

let bookings = [];

exports.create = (req, res) => {
  const { name, people, time } = req.body;

  if (!name || !people || !time) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const table = TableService.assignTable(people);

  if (!table) {
    return res.status(400).json({ message: "No table available" });
  }

  const newBooking = new Booking(Date.now(), name, people, time, table.id);

  bookings.push(newBooking);

  res.json(newBooking);
};

exports.list = (req, res) => {
  res.json(bookings);
};

exports.cancel = (req, res) => {
  const booking = bookings.find((b) => b.id == req.params.id);

  if (booking) {
    TableService.releaseTable(booking.tableId);
  }

  bookings = bookings.filter((b) => b.id != req.params.id);

  res.json({ message: "Booking cancelled" });
};
