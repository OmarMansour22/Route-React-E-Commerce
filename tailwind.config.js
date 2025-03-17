/** @type {import('tailwindcss').Config} */
import { defineConfig } from "tailwindcss";
export default {
  darkMode: "class", // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: "#ff5733",
        dark: "#1a1a1a",
      },
    },
  },
};

