// Top navigation bar. Shows the app name, a dark-mode toggle,
// and a logout button when the user is logged in.

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between bg-blue-600 px-6 py-4 text-white dark:bg-gray-800">
      <h1 className="text-xl font-bold">🧮 Calculator App</h1>

      <div className="flex items-center gap-4">
        {/* Dark mode toggle (bonus feature) */}
        <button
          onClick={toggle}
          className="rounded bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-3 py-1 text-sm hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
