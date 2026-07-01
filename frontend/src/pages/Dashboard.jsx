// Dashboard: a calculator with a keypad and a "Recents" history popup.

import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { previewResult } from "../utils/evaluate";
import RecentsModal from "../components/RecentsModal";

// The keypad layout, row by row (matches the design).
const KEYS = [
  ["C", "()", "%", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "+"],
  ["1", "2", "3", "-"],
  ["+/-", "0", ".", "="],
];

export default function Dashboard() {
  const { user } = useAuth();

  const [expression, setExpression] = useState(""); // what the user is typing
  const [error, setError] = useState("");            // e.g. "Cannot divide by zero"
  const [history, setHistory] = useState([]);
  const [showRecents, setShowRecents] = useState(false);

  // Load history when the page opens
  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await api.get("/calculations");
      setHistory(res.data);
    } catch (err) {
      console.error("Could not load history", err);
    }
  }

  // Live preview number shown under the expression
  const preview = previewResult(expression);

  // Handle a key press
  function handleKey(key) {
    setError("");

    if (key === "C") {
      setExpression("");
      return;
    }
    if (key === "=") {
      handleEquals();
      return;
    }
    if (key === "()") {
      addParenthesis();
      return;
    }
    if (key === "+/-") {
      toggleSign();
      return;
    }
    // Numbers, ., % and operators just get added to the expression
    setExpression((prev) => prev + key);
  }

  // Backspace: remove the last character
  function handleBackspace() {
    setError("");
    setExpression((prev) => prev.slice(0, -1));
  }

  // Smart parenthesis: add "(" or ")" depending on what makes sense
  function addParenthesis() {
    const open = (expression.match(/\(/g) || []).length;
    const close = (expression.match(/\)/g) || []).length;
    const last = expression.slice(-1);
    const canClose = open > close && /[0-9)]/.test(last);
    setExpression((prev) => prev + (canClose ? ")" : "("));
  }

  // +/- : wrap the whole expression in a negative, or undo it
  function toggleSign() {
    if (!expression) return;
    if (expression.startsWith("-(") && expression.endsWith(")")) {
      setExpression(expression.slice(2, -1));
    } else {
      setExpression(`-(${expression})`);
    }
  }

  // "=" : ask the backend to calculate + save, then show the result
  async function handleEquals() {
    if (!expression.trim()) return;
    try {
      const res = await api.post("/calculations", { expression });
      // Show the result and let the user keep calculating from it
      setExpression(String(res.data.result));
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Calculation failed.");
    }
  }

  // Delete one history item
  async function handleDelete(id) {
    try {
      await api.delete(`/calculations/${id}`);
      loadHistory();
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  // Clear all history
  async function handleClearAll() {
    try {
      await api.delete("/calculations");
      loadHistory();
    } catch (err) {
      console.error("Clear failed", err);
    }
  }

  // Give each key its own colour
  function keyClass(key) {
    if (key === "=") return "bg-cyan-500 text-white hover:bg-cyan-600";
    if (key === "C") return "bg-white text-red-500 dark:bg-gray-700";
    return "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100";
  }

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Welcome, <span className="font-semibold">{user?.name}</span> 👋
      </p>

      {/* Calculator card */}
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg dark:bg-gray-800">
        {/* Display */}
        <div className="mb-4 min-h-[90px] text-right">
          <div className="break-all text-4xl font-light text-gray-800 dark:text-gray-100">
            {expression || "0"}
          </div>
          {error ? (
            <div className="mt-2 text-sm text-red-500">{error}</div>
          ) : (
            preview !== null &&
            String(preview) !== expression && (
              <div className="mt-2 text-lg text-cyan-500">{preview}</div>
            )
          )}
        </div>

        {/* Row of icons: history (left) and backspace (right) */}
        <div className="mb-3 flex items-center justify-between px-1 text-xl text-gray-600 dark:text-gray-300">
          <button onClick={() => setShowRecents(true)} aria-label="Recents">
            🕘
          </button>
          <button onClick={handleBackspace} aria-label="Backspace">
            ⌫
          </button>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {KEYS.flat().map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className={`h-16 rounded-2xl text-xl font-medium shadow-sm transition active:scale-95 ${keyClass(
                key
              )}`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Recents popup */}
      {showRecents && (
        <RecentsModal
          history={history}
          onClose={() => setShowRecents(false)}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      )}
    </div>
  );
}
