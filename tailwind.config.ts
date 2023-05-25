import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    fontFamily: {
      sans: ["Cera Pro", "sans-serif"],
      body: ["Cera Pro", "sans-serif"],
    },
    extend: {
      colors: {
        "cs-primary": "#ff4261",
        "cs-secondary": "#cd7e8b",
        "cs-dark-100": "#E7E7E7",
        "cs-dark-300": "#A1A1A1",
        "cs-dark-500": "#5C5C5C",
        "cs-dark-600": "#3C3C3C",
        "cs-dark-800": "#2D2D2D",
        "cs-dark-900": "#000106",
        "cs-red": "#CE4438",
        "cs-red-dark": "#471A21",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
} satisfies Config;
