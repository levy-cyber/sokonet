/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00C853', // Neon Green
          dark: '#00A040',
          light: '#33D375',
          glow: 'rgba(0, 200, 83, 0.15)',
        },
        dark: {
          bg: '#070a13',      // Dark black-navy
          card: '#0f1424',    // Card base
          cardMuted: '#171e35',
          border: '#1e294b',  // Subtle navy border
          text: '#f8fafc',
          muted: '#94a3b8',
        }
      },
      backgroundImage: {
        'glass-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 200, 83, 0.08), transparent 70%)',
      },
      boxShadow: {
        'glow-green': '0 0 15px 2px rgba(0, 200, 83, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
