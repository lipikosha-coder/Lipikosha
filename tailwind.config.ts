import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#FAF7F0",
          50: "#FDFCF7",
          100: "#FAF7F0",
          200: "#F3EDE0",
          300: "#E6DEC8",
          400: "#D4C7A5",
          500: "#B8A578",
        },
        forest: {
          DEFAULT: "#0E3B23",
          light: "#165534",
          dark: "#082415",
          hover: "#14492c",
        },
        gold: {
          DEFAULT: "#C6923A",
          light: "#DCAB56",
          dark: "#A37424",
          subtle: "#F9F3E5",
        },
        emerald: {
          download: "#059669",
          hover: "#047857",
        },
        surface: {
          card: "#FFFFFF",
          border: "#E6DEC8",
          muted: "#F7F5EE",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "Cinzel", "serif"],
        heading: ["var(--font-plus-jakarta-sans)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(14, 59, 35, 0.04), 0 1px 3px rgba(14, 59, 35, 0.02)',
        'card-hover': '0 12px 30px rgba(14, 59, 35, 0.08), 0 4px 8px rgba(14, 59, 35, 0.04)',
        'gold-glow': '0 0 25px rgba(198, 146, 58, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
