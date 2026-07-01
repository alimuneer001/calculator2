// Evaluates a math expression on the frontend ONLY for the live preview
// (the small number shown under what you type). The real, saved result
// still comes from the backend when you press "=".
//
// Returns a number, or null if the expression isn't valid yet.
export function previewResult(expression) {
  if (!expression || !expression.trim()) return null;

  // Same character whitelist as the backend for safety.
  if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) return null;

  try {
    const value = Function(`"use strict"; return (${expression});`)();
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    // Round to avoid ugly floating point tails
    return Math.round(value * 1e10) / 1e10;
  } catch {
    return null;
  }
}
