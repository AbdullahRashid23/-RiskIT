/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'responsive-huge': 'clamp(4rem, 12vw, 20rem)',
        'responsive-big': 'clamp(3rem, 8vw, 16rem)',
        'responsive-large': 'clamp(2rem, 6vw, 12rem)',
        'responsive-title': 'clamp(2rem, 5vw, 7rem)',
      },
      spacing: {
        'responsive-xl': 'clamp(1rem, 3vw, 6rem)',
        'responsive-lg': 'clamp(0.75rem, 2vw, 4rem)',
        'responsive-md': 'clamp(0.5rem, 1.5vw, 2.5rem)',
      }
    },
  },
  plugins: [],
}
