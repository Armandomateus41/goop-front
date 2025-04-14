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
          DEFAULT: "#2563eb",    
          dark: "#1e40af",       
          red: "#ef4444",        
          bg: "#f9fafb",         // Fundo claro
        },
        destructive: "#ef4444",  
      },
    },
  },
  plugins: [],
}
