// Main server file. Starts the Express app.

const express = require("express");
const cors = require("cors");

const config = require("./config/env");
const initDb = require("./config/initDb");
const authRoutes = require("./routes/auth");
const calculationRoutes = require("./routes/calculations");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// --- CORS: decide which frontend URLs may call this API ---
// We allow the configured CLIENT_URL (local dev) and any *.vercel.app URL,
// so Vercel's changing preview URLs keep working without extra config.
const allowedOrigins = [config.clientUrl, /\.vercel\.app$/];

app.use(
  cors({
    origin(origin, callback) {
      // Requests with no origin (e.g. curl, health checks) are allowed.
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((rule) =>
        rule instanceof RegExp ? rule.test(origin) : rule === origin
      );
      callback(isAllowed ? null : new Error("Not allowed by CORS"), isAllowed);
    },
  })
);

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
