/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./index.{js,ts}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          deepBlue: "#0A5D84",
          teal: "#0B7A75",
          tealLight: "#179E95",
          skyBlue: "#1287B8",
          bgLight: "#EAF8F8",
          bgCard: "#EDF6FC",
          textDark: "#0D2B3E",
          textMuted: "#5A8DA8",
          white: "#FFFFFF",
          error: "#E53935",
          success: "#2E7D32",
          warning: "#F57F17",
          border: "#C8E6F5",
        },
      },
    },
  },
  plugins: [],
};
