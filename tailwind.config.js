/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f8ff',
          100: '#e6f1ff',
          600: '#0d4fd7',
          700: '#0a3fae'
        }
      }
    }
  },
  plugins: []
};
