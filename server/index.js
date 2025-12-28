// server/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const aiInterviewRoutes = require("./routes/aiInterview");

const app = express();

// ---------- CORS SETUP ----------
const allowedOrigins = [
  "http://localhost:3000",                    // local React
  "http://localhost:3001",                    // local React (alternative port)
  "http://localhost:3007",                    // local React (current port)
  "https://nee-tunnel-url.ngrok-free.app",   // <-- idi ni tunnel / public URL tho replace cheyyi
  // "https://nee-frontend.vercel.app",       // later deploy ayyaka add cheyyi
];

app.use(
  cors({
    origin: true, // Allow any origin for development
    credentials: true,
  })
);

// ---------- BODY PARSER ----------
app.use(express.json());

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai", aiInterviewRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Server ok" });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;

console.log('Starting server...');
console.log('PORT:', PORT);

connectDB().then(() => {
  console.log('Database connected, starting server...');
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server address: http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  server.on('listening', () => {
    console.log('Server is listening on port', PORT);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});
