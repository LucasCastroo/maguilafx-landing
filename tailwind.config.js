/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maguilaDark: "#050509",
        maguilaRed: "#FF2A2A",
        maguilaGold: "#FFC857",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 255, 255, 0.45)",
        "glow-red": "0 0 40px rgba(255, 42, 42, 0.7)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
