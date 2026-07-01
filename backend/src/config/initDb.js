// Creates the database tables if they don't exist yet.
// This runs once when the server starts, so a fresh database (e.g. on Railway)
// is set up automatically. It is safe to run every time because schema.sql
// uses "CREATE TABLE IF NOT EXISTS".

const fs = require("fs");
const path = require("path");
const db = require("./db");

async function initDb() {
  const schemaPath = path.join(__dirname, "../../schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await db.query(schema);
  console.log("✅ Database tables are ready.");
}

module.exports = initDb;
