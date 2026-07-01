-- Run this file once to create the database tables.
-- Example:  psql -U postgres -d calculator_db -f schema.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Calculations table (history)
CREATE TABLE IF NOT EXISTS calculations (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expression VARCHAR(255) NOT NULL,
  result     DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
