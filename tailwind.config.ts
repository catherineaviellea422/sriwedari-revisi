import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "brand-green": "#1F4A3A",
        "brand-green-dark": "#14382C",
        "brand-gold": "#C8A25A",
        canvas: "#F6F1E7",
        parchment: "#FBF8F2",
        primary: "#033325",
        "primary-container": "#1F4A3A",
        "on-primary": "#ffffff",
        "on-primary-container": "#8cb9a4",
        "primary-fixed": "#beedd7",
        "primary-fixed-dim": "#a3d0bb",
        secondary: "#785918",
        "secondary-container": "#fed487",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#795a19",
        "secondary-fixed": "#ffdea5",
        "secondary-fixed-dim": "#e9c175",
        surface: "#fef9ef",
        "surface-bright": "#fef9ef",
        "surface-dim": "#dedad0",
        "surface-variant": "#e7e2d8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8f3e9",
        "surface-container": "#f2ede3",
        "surface-container-high": "#ede8de",
        "surface-container-highest": "#e7e2d8",
        "on-surface": "#1d1c16",
        "on-surface-variant": "#414944",
        outline: "#717974",
        "outline-variant": "#c0c8c3",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "sriwedari-primary": "#1F4A3A",
        "sriwedari-deep": "#0d1e18",
        "sriwedari-gold": "#C8A25A",
        "sriwedari-cream": "#F6F1E7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", '"Playfair Display"', "Georgia", "serif"],
      },
      boxShadow: {
        "card-warm": "0 4px 20px -2px rgba(20, 56, 44, 0.08)",
        "gold-glow": "0 0 20px rgba(200, 162, 90, 0.35)",
        card: "0 2px 10px rgba(31, 74, 58, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
      },
      keyframes: {
        eq: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
