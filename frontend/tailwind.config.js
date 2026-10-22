/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ink-950": "#0f051d",
        "ink-900": "#1e0b36",
        "ink-800": "#2e1052",
        "sidebar": "#0d041a",
        "workspace": "#f8fafc",
        "cyan-neon": "#22d3ee",
        "pink-neon": "#f43f5e",
        "hot-pink": "#ec4899",
        "violet-glow": "#8b5cf6",
        "blue-royal": "#4f46e5",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 24px rgba(124, 58, 237, 0.55)",
        "glow-cyan": "0 0 24px rgba(34, 211, 238, 0.45)",
        "glow-pink": "0 0 24px rgba(236, 72, 153, 0.45)",
        "card-soft": "0 1px 3px rgba(15, 5, 29, 0.06), 0 8px 24px rgba(15, 5, 29, 0.06)",
      },
    },
  },
  plugins: [],
};
