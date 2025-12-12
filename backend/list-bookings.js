// list-bookings.js
// Prints all bookings' _id and id fields from MongoDB

const mongoose = require("mongoose");
const Booking = require("./models/Booking");

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://KaiSheng1030:IloveAzure123@restoks.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

mongoose.connect(MONGO_URI).then(async () => {
  const bookings = await Booking.find();
  bookings.forEach(b => {
    console.log({ _id: b._id, id: b.id });
  });
  mongoose.disconnect();
});
