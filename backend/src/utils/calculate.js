// Safely evaluates a math expression string like "17*64" or "(10+5)/3".
// Returns { result } on success or { error } on failure.

function evaluateExpression(expression) {
  if (!expression || !expression.trim()) {
    return { error: "Expression is empty." };
  }

  // Security whitelist: only numbers, math operators, dots, parentheses and
  // spaces are allowed. This blocks letters/code so nothing harmful can run.
  if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
    return { error: "Expression contains invalid characters." };
  }

  let value;
  try {
    // Safe because the characters were whitelisted above.
    value = Function(`"use strict"; return (${expression});`)();
  } catch {
    return { error: "Invalid expression." };
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    return { error: "Invalid expression." };
  }
  if (!Number.isFinite(value)) {
    return { error: "Cannot divide by zero." }; // e.g. 10 / 0
  }

  // Round to avoid floating point tails like 0.30000000000000004
  return { result: Math.round(value * 1e10) / 1e10 };
}

module.exports = { evaluateExpression };
