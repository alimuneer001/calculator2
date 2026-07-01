// One-time helper: tests the DB connection and creates the tables.
// Run it with:  node setup-db.js
// It connects to the database in your .env (DATABASE_URL) and runs schema.sql.

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set. Make sure backend/.env exists.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log("🔌 Connecting to the database...");
    await pool.query("SELECT 1");
    console.log("✅ Connected!");

    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    console.log("🛠️  Creating tables...");
    await pool.query(schema);
    console.log("✅ Tables are ready. You can now register and log in.");
  } catch (err) {
    console.error("❌ Setup failed:", err.message);
    if (err.code === "3D000") {
      console.error("   The database in your URL does not exist yet. Create it first.");
    }
    if (err.code === "28P01") {
      console.error("   Wrong username or password in DATABASE_URL.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("   PostgreSQL is not running, or the host/port is wrong.");
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
