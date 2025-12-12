const mongoose = require('mongoose');
const fs = require('fs');

// Update this to your MongoDB connection string
const uri = 'mongodb+srv://KaiSheng1030:IloveAzure123@restoks.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';

mongoose.connect(uri);

const Table = require('./models/Table');
const Booking = require('./models/Booking');
const User = require('./models/User');

const Floorplan = require('./models/Floorplan');
const BookingHistory = require('./models/BookingHistory');

async function migrate() {
  try {
    // Migrate tables
    const tables = JSON.parse(fs.readFileSync('tables.json'));
    await Table.deleteMany({});
    await Table.insertMany(tables);

    // Migrate bookings
    const bookings = JSON.parse(fs.readFileSync('bookings.json'));
    await Booking.deleteMany({});
    await Booking.insertMany(bookings);

    // Migrate users
    const users = JSON.parse(fs.readFileSync('users.json'));
    await User.deleteMany({});
    await User.insertMany(users);

    // Migrate floorplan layout
    const floorplanLayout = JSON.parse(fs.readFileSync('floorplan-layout.json'));
    await Floorplan.deleteMany({});
    await Floorplan.create({ id: 1, name: 'Main', layout: floorplanLayout });

    // Migrate booking history
    const bookingHistory = JSON.parse(fs.readFileSync('booking-history.json'));
    await BookingHistory.deleteMany({});
    await BookingHistory.insertMany(bookingHistory);

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    mongoose.disconnect();
  }
}

migrate();
