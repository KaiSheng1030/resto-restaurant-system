// list-tables.js
// Prints all tables' id and _id fields from MongoDB

const mongoose = require("mongoose");
const Table = require("./models/Table");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/resto";

mongoose.connect(MONGO_URI).then(async () => {
  const tables = await Table.find();
  tables.forEach(t => {
    console.log({ _id: t._id, id: t.id, capacity: t.capacity });
  });
  mongoose.disconnect();
});
