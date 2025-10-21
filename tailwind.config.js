/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f6ff",
          100: "#e3ecff",
          200: "#c7daff",
          300: "#a0c0ff",
          400: "#6f9dff",
          500: "#3d74ff",
          600: "#1d53f3",
          700: "#1642c0",
          800: "#12379a",
          900: "#0f2f7c"
        }
      }
    },
  },
  plugins: [],
}