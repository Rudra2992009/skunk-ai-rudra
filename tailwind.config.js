/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}", "./src/**/*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"],
      },
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        skunk: {
          ink: "#0b0b0e",
          musk: "#0f172a",
          mint: "#10b981",
          violet: "#7c3aed",
          haze: "#94a3b8",
          white: "#ffffff"
        }
      },
      boxShadow: {
        glow: "0 0 0 2px rgba(124,58,237,0.15), 0 10px 30px rgba(124,58,237,0.25)",
      },
      backgroundImage: {
        'radial': 'radial-gradient(1000px 600px at top right, rgba(124,58,237,0.25), transparent 60%)',
        'grid': 'linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.15) 1px, transparent 1px)'
      },
      backgroundSize: {
        grid: '24px 24px'
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
