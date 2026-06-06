export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#00C853',
          600: '#00B048',
          700: '#019544',
        },
      },
      boxShadow: {
        soft: '0 24px 60px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
};
