import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857"
        }
      },
      boxShadow: {
        soft: "0 12px 40px rgba(15, 23, 42, 0.08)",
        "soft-dark": "0 12px 40px rgba(0, 0, 0, 0.35)",
        glow: "0 10px 30px rgba(16, 185, 129, 0.25)"
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.98)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "pulse-slow": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.6" } }
      },
      animation: {
        "fade-in": "fade-in 500ms ease-out both",
        "slide-up": "slide-up 600ms ease-out both",
        "scale-in": "scale-in 350ms ease-out both",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
