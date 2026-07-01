// Handles user registration and login.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const config = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");

// Create a JWT token for a user
function createToken(user) {
  return jwt.sign({ id: user.id, name: user.name }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

// Only send safe user fields back to the client (never the password)
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  // Make sure the email isn't already taken
  const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

  const result = await db.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  const user = result.rows[0];

  // Log the user in immediately after signing up
  res.status(201).json({
    message: "Registration successful.",
    token: createToken(user),
    user: publicUser(user),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  // Use the same message whether the email or password is wrong,
  // so we don't reveal which emails are registered.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    message: "Login successful.",
    token: createToken(user),
    user: publicUser(user),
  });
});

module.exports = { register, login };
