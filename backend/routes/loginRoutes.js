const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: "Invalid login" });
    const token = Buffer.from(`${user.username}-${Date.now()}`).toString("base64");
    return res.json({
      token,
      username: user.username,
      role: user.role
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
