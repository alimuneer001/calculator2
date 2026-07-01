// Main server file. Starts the Express app.

const express = require("express");
const cors = require("cors");

const config = require("./config/env");
const initDb = require("./config/initDb");
const authRoutes = require("./routes/auth");
const calculationRoutes = require("./routes/calculations");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// --- Global middleware ---
app.use(cors({ origin: config.clientUrl })); // only allow our frontend
app.use(express.json()); // parse JSON request bodies

// --- Routes ---
app.get("/", (req, res) => res.json({ message: "Calculator API is running." }));
app.use("/api/auth", authRoutes);
app.use("/api/calculations", calculationRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

// --- Start ---
// Make sure the tables exist, then start listening.
initDb()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`✅ Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Could not start server (database init failed):", err);
    process.exit(1);
  });
