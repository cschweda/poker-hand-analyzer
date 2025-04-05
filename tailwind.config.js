/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        gray: {
          900: "#121212",
          800: "#1e1e1e",
          700: "#2a2a2a",
          600: "#363636",
          500: "#505050",
          400: "#737373",
          300: "#a3a3a3",
          200: "#d4d4d4",
          100: "#e5e5e5",
          50: "#f5f5f5",
        },
      },
    },
  },
  plugins: [],
};
