import tailwindcssLineClamp from "@tailwindcss/line-clamp";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ["var(--font-custom)", "system-ui", "sans-serif"],
      },
      colors: {
        // Fresh, light theme with green brand (logo-inspired), white backgrounds, and colored cards
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e", // Main green (logo)
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        background: {
          DEFAULT: "#f8fafc", // soft white
          light: "#ffffff", // pure white for sections
        },
        foreground: {
          DEFAULT: "#18181b", // dark for contrast
          light: "#4ade80", // green accent for highlights
        },
        card: {
          DEFAULT: "#e6f9f3", // soft mint green for cards
          green: "#dcfce7", // light green card
          yellow: "#fef9c3", // light yellow card
          pink: "#fce7f3", // light pink card
          foreground: "#18181b",
        },
        popover: {
          DEFAULT: "#f1f5f9",
          foreground: "#18181b",
        },
        primary: {
          DEFAULT: "#22c55e", // green
          foreground: "#fff",
        },
        secondary: {
          DEFAULT: "#0ea5e9", // blue accent
          foreground: "#fff",
        },
        muted: {
          DEFAULT: "#f1f5f9", // very light gray
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#fbbf24", // yellow accent
          foreground: "#fff",
        },
        destructive: {
          DEFAULT: "#ef4444", // strong red
          foreground: "#fff",
        },
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#22c55e",
        chart: {
          1: "#22c55e",
          2: "#0ea5e9",
          3: "#fbbf24",
          4: "#f472b6",
          5: "#f59e42",
        },
        sidebar: {
          DEFAULT: "#e0f2fe",
          foreground: "#18181b",
          primary: "#22c55e",
          "primary-foreground": "#fff",
          accent: "#0ea5e9",
          "accent-foreground": "#fff",
          border: "#bae6fd",
          ring: "#22c55e",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssLineClamp],
};
export default config;
