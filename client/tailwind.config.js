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
