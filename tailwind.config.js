/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0055ff', // Adjusted for slightly neon look
        'brand-dark': '#070b14', // Very dark blue/black background
        'brand-card': '#101726', // Darker card background
        'brand-border': '#1e293b', // Subtle border
        'brand-text': '#f8fafc',
        'brand-text-muted': '#94a3b8'
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
