// --- Azure MongoDB Connection ---
// --- Azure MongoDB Connection ---
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://KaiSheng1030:IloveAzure123@restoks.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000")
  .then(() => console.log("✅ Connected to Azure MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const bookingRoutes = require("./routes/bookingRoutes");
const loginRoutes = require("./routes/loginRoutes");
const tableRoutes = require("./routes/tableRoutesX"); 
const floorplanRoutes = require("./routes/floorplanRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/floorplan", floorplanRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
