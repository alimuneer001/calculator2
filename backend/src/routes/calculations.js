// Calculation routes:  /api/calculations/...
// Every route here is protected by the authenticateUser middleware.

const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");
const {
  createCalculation,
  getCalculations,
  deleteCalculation,
  clearCalculations,
} = require("../controllers/calculationController");

// Protect all routes below this line
router.use(authenticateUser);

router.post("/", createCalculation);      // Create a calculation
router.get("/", getCalculations);         // Get user's history
router.delete("/:id", deleteCalculation); // Delete one
router.delete("/", clearCalculations);    // Clear all

module.exports = router;
