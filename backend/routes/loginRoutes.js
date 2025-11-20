const express = require("express");
const router = express.Router();
const users = require("../users.json");

router.post("/", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ message: "Invalid login" });

  const token = Buffer.from(`${user.username}-${Date.now()}`).toString("base64");

  return res.json({
    token,
    username: user.username,
    role: user.role
  });
});

module.exports = router;
