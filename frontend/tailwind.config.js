/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#101828",
        brand: {
          DEFAULT: "#2563EB",
          light: "#EFF6FF",
          dark: "#1D4ED8",
        },
        surface: {
          bg: "#F5F7FB",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
        content: {
          DEFAULT: "#1E293B",
          muted: "#64748B",
        },
        status: {
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
