/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        title: ["DM Sans", "sans-serif"],
      },
      colors: {
        goop: {
          DEFAULT: "#2563eb",    // Azul principal
          dark: "#1e40af",       // Azul escuro
          red: "#ef4444",        // Vermelho Goop
          bg: "#f9fafb",         // Fundo claro
        },
        destructive: "#ef4444",  
      },
    },
  },
  plugins: [],
}
