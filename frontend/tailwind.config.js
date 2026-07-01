/** @type {import('tailwindcss').Config} */
export default {
  // "class" strategy lets us toggle dark mode by adding a "dark" class to <html>
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
