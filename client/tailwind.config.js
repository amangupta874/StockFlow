/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#0b1020",
        brand: {
          coral: "#ff6b6b",
          mint: "#2dd4bf",
          blue: "#3b82f6",
          gold: "#f59e0b"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(45, 212, 191, 0.18)",
        panel: "0 20px 60px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};
