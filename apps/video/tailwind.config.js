/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wabrix: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        whatsapp: {
          green: "#25D366",
          dark: "#075E54",
          light: "#DCF8C6",
          chatbg: "#EFEAE2",
          darkbg: "#0B141A",
          bubbleOut: "#D9FDD3",
          bubbleIn: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
