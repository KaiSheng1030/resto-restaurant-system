const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const bookingRoutes = require("./routes/bookingRoutes");
const loginRoutes = require("./routes/loginRoutes");
const tableRoutes = require("./routes/tableRoutesX"); // ⭐ 使用 tableRoutesX

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/tables", tableRoutes); // ⭐ 让前端可以访问桌子 API

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
