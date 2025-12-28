const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const { sendLoginAlert } = require("../utils/email");

/**
 * POST /api/auth/register
 * Body: { name, email, password, level }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, level } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // email already exists?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      level: level || "beginner",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
      },
    });
  } catch (err) {
    console.error("Register error FULL:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // make sure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in .env");
      return res.status(500).json({ message: "Server config error" });
    }

    // JWT token (email kuda include chesam)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Debug logs
    console.log("LOGIN OK for", user.email);

    // Login alert email
    sendLoginAlert({
      to: process.env.OWNER_EMAIL,
      userEmail: user.email,
      userName: user.name,
    })
      .then(() => console.log("MAIL SENT FUNC RESOLVED"))
      .catch((err) => console.error("Login email error:", err));

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
      },
    });
  } catch (err) {
    console.error("Login error FULL:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
