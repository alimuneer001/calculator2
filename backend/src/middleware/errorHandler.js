// Central error handling for the whole app.

// Runs when no route matched the request (404 Not Found).
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Runs whenever a route handler throws an error.
// It logs the real error on the server and sends a safe message to the client.
function errorHandler(err, req, res, next) {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}

module.exports = { notFound, errorHandler };
