// Handles creating, reading and deleting calculations.

const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { evaluateExpression } = require("../utils/calculate");

// POST /api/calculations   body: { expression: "17*64" }
const createCalculation = asyncHandler(async (req, res) => {
  const { expression } = req.body;

  const { result, error } = evaluateExpression(expression);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const saved = await db.query(
    "INSERT INTO calculations (user_id, expression, result) VALUES ($1, $2, $3) RETURNING *",
    [req.user.id, expression.trim(), result]
  );

  res.status(201).json(saved.rows[0]);
});

// GET /api/calculations   (the logged-in user's history, newest first)
const getCalculations = asyncHandler(async (req, res) => {
  const result = await db.query(
    "SELECT * FROM calculations WHERE user_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(result.rows);
});

// DELETE /api/calculations/:id   (delete one record owned by the user)
const deleteCalculation = asyncHandler(async (req, res) => {
  const result = await db.query(
    "DELETE FROM calculations WHERE id = $1 AND user_id = $2 RETURNING id",
    [req.params.id, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Calculation not found." });
  }
  res.json({ message: "Calculation deleted." });
});

// DELETE /api/calculations   (clear all of the user's history)
const clearCalculations = asyncHandler(async (req, res) => {
  await db.query("DELETE FROM calculations WHERE user_id = $1", [req.user.id]);
  res.json({ message: "History cleared." });
});

module.exports = {
  createCalculation,
  getCalculations,
  deleteCalculation,
  clearCalculations,
};
