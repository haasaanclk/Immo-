import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: "#F4F1EA", 2: "#EBE5D8" },
        forest: { DEFAULT: "#1E3A2F", deep: "#14241C" },
        brass: { DEFAULT: "#B08D57", soft: "#C9A86A" },
        ink: "#1C1B19",
        burgundy: "#5E2B2B",
        sage: "#8A9A86",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-garamond)", "Georgia", "serif"],
        label: ["var(--font-jost)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.42em",
        label: "0.28em",
      },
      maxWidth: {
        wrap: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
