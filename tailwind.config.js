/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./@/components/**/*.{ts,tsx}",
    "./@/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          DEFAULT: "var(--primary)",
        },
        secondary: {
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
          DEFAULT: "var(--secondary)",
        },
        neutral: {
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
        },
        // Shadcn color mappings (improved for dark UI)
        background: "#18181b", // dark neutral
        foreground: "#f4f4f5", // light neutral
        card: "#232329", // slightly lighter than background
        "card-foreground": "#f4f4f5",
        popover: "#232329",
        "popover-foreground": "#f4f4f5",
        muted: {
          DEFAULT: "#27272a", // dark muted
          foreground: "#a1a1aa", // muted text
        },
        accent: {
          DEFAULT: "#27272a", // accent for dark
          foreground: "#f4f4f5",
        },
        destructive: {
          DEFAULT: "#ef4444", // red-500
          foreground: "#fff",
        },
        border: "#27272a", // dark border
        input: "#232329", // input bg
        ring: "#6366f1", // indigo-500 for focus ring
      },
      animation: {
        flip: "flip 0.8s ease-in-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0)" },
          "100%": { transform: "rotateY(180deg)" },
        },
      },
      rotate: {
        "y-180": "rotateY(180deg)",
        "y-0": "rotateY(0deg)",
      },
      transitionDuration: {
        800: "800ms",
      },
      backfaceVisibility: {
        hidden: "hidden",
        visible: "visible",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      perspective: {
        1000: "1000px",
      },
    },
  },
  plugins: [],
};
