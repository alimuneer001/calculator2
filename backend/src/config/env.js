// Loads environment variables and checks that the important ones exist.
// If something required is missing, we stop the server right away with a
// clear message instead of crashing later with a confusing error.

require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing required environment variable: ${name}`);
    console.error("   Check your backend/.env file (see .env.example).");
    process.exit(1);
  }
  return value;
}

const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  databaseUrl: required("DATABASE_URL"),
  dbSsl: process.env.DB_SSL === "true",

  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  bcryptRounds: 10,
};

module.exports = config;
