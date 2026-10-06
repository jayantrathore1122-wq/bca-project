const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db, save } = require("../db");
const { protect, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { username, email, password, fullName } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const exists = db.users.some(
    (u) => u.email === email.toLowerCase() || u.username === username.toLowerCase()
  );
  if (exists) return res.status(400).json({ message: "Username or email already in use" });

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: crypto.randomUUID(),
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashed,
    fullName: fullName || "",
    bio: "",
    profilePic: "",
    followers: [],
    following: [],
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  save();

  res.status(201).json({ ...publicUser(user), token: generateToken(user.id) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === (email || "").toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ ...publicUser(user), token: generateToken(user.id) });
});

router.get("/me", protect, (req, res) => {
  res.json(publicUser(req.user));
});

module.exports = router;
