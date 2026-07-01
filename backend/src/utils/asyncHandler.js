// A tiny helper that wraps an async route handler.
// If the handler throws (or a promise rejects), the error is passed to
// Express's error handler automatically — so we don't need try/catch in
// every controller. This keeps the controllers short and easy to read.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
