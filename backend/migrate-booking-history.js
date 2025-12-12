// migrate-booking-history.js
// Migration script: Import bookings from booking-history.json to MongoDB using Mongoose
// Does NOT touch any existing functions or code

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Booking = require("./models/Booking");

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://KaiSheng1030:IloveAzure123@restoks.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
const historyPath = path.join(__dirname, "booking-history.json");

async function migrate() {
  await mongoose.connect(MONGO_URI);
  const bookings = JSON.parse(fs.readFileSync(historyPath, "utf8"));
  for (const b of bookings) {
    // Prepare booking object for MongoDB
    const booking = {
      name: b.name,
      phone: b.phone,
      people: b.people,
      table: b.table,
      time: b.time,
      date: b.date,
      status: "archived", // or "active" if you want
      cancelled: false
    };
    try {
      await Booking.create(booking);
      console.log("Imported booking:", booking.name, booking.date, booking.time);
    } catch (err) {
      console.error("Failed to import booking:", booking, err);
    }
  }
  await mongoose.disconnect();
  console.log("Migration complete.");
}

if (require.main === module) {
  migrate();
}
