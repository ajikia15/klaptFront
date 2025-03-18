/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#D1CAE9",
          200: "#B39DDB",
          300: "#9575CD",
          400: "#7E57C2",
          500: "#673AB7",
          600: "#5E35B1",
          700: "#512DA8",
          800: "#4527A0",
          900: "#311B92",
        },
        secondary: {
          100: "#E1BEE7",
          200: "#CE93D8",
          300: "#BA68C8",
          400: "#AB47BC",
          500: "#9C27B0",
          600: "#8E24AA",
          700: "#7B1FA2",
          800: "#6A1B9A",
          900: "#4A148C",
        },
        neutral: {
          100: "#E6E6E8",
          200: "#C1C0C5",
          300: "#9C9BA3",
          400: "#83828C",
          500: "#6B6975",
          600: "#52505E",
          700: "#393747",
          800: "#201E30", // bg color
          900: "#151225",
        },
      },
    },
  },
  plugins: [],
};
