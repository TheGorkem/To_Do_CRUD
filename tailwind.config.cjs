/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1120",
        ember: "#ff6a3d",
        mint: "#36d399",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 106, 61, 0.2)",
      },
    },
  },
  plugins: [],
};
