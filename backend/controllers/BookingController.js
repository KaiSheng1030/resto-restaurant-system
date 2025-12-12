
const Booking = require("../models/Booking");
const TableService = require("../services/TableService");

// Create a new booking and save to MongoDB
exports.create = async (req, res) => {
  try {
    const { name, people, time, phone, date } = req.body;
    if (!name || !people || !time || !phone || !date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Assign a table (optional: you may want to check for available tables here)
    const table = TableService.assignTable(people);
    if (!table) {
      return res.status(400).json({ message: "No table available" });
    }

    const newBooking = new Booking({
      name,
      people,
      time,
      phone,
      date,
      table: table.id,
      status: "active"
    });
    await newBooking.save();
    res.json(newBooking);
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
};

// List all bookings from MongoDB
exports.list = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// Cancel a booking by ID and update table availability
exports.cancel = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      TableService.releaseTable(booking.table);
      booking.status = "cancelled";
      booking.cancelled = true;
      await booking.save();
      res.json({ message: "Booking cancelled" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error cancelling booking", error: err.message });
  }
};
