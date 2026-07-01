// Authentication middleware.
// Reads the JWT from the "Authorization" header, verifies it, and attaches
// the user to the request. Used to protect private routes.

const jwt = require("jsonwebtoken");
const config = require("../config/env");

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  // Expected format:  Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { id: decoded.id, name: decoded.name };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = authenticateUser;
