/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ important
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBg: "#f8fafc",
        darkBg: "#0f172a",
        lightCard: "#ffffff",
        darkCard: "#1e293b",
        lightText: "#1e293b",
        darkText: "#f1f5f9",
        accent: "#2563eb", // blue-600
      },
    },
  },
  plugins: [],
};
