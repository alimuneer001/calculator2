// Database connection using the "pg" library.
// We create ONE connection pool and reuse it everywhere.

const { Pool } = require("pg");
const config = require("./env");

const pool = new Pool({
  connectionString: config.databaseUrl,
  // Hosted databases (Neon, Supabase, Render, Railway) require SSL.
  // Set DB_SSL=true in your .env when using one.
  ssl: config.dbSsl ? { rejectUnauthorized: false } : false,
});

// Helper so we can write:  db.query("SELECT ...", [values])
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
