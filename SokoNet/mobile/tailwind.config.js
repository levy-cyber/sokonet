/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#00C853',
          600: '#00B048',
          700: '#019544',
        },
      },
    },
  },
  plugins: [],
};
