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
        olive: {
          50: '#F5F7EE',
          100: '#EEF2E6',
          200: '#DCE4CC',
          300: '#C2D1A8',
          400: '#94A668',
          500: '#7B8C4F',
          600: '#6B7A40',
          700: '#5A6836',
          800: '#48542A',
          900: '#3A4422',
        },
        charcoal: {
          700: '#3E4248',
          800: '#303236',
          850: '#27282C',
          900: '#202124',
          950: '#18191B',
        },
        priority: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}
