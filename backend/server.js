console.log("Server.js is starting...");
// Load environment variables
require('dotenv').config();

// --- Azure MongoDB Connection ---
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
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

// Configure CORS to allow your frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://black-sky-050afb700.3.azurestaticapps.net',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/floorplan", floorplanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
