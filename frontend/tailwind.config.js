/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        euca: {
          50:  '#e9f7ef',
          100: '#d6f1e3',
          200: '#aee4c8',
          300: '#86d7ae',
          400: '#5ecb94',
          500: '#37be7a',
          600: '#2da866',
          700: '#228353',
          800: '#185f3f',
          900: '#0f3f2d',
          950: '#0b2e22',
        },
      },
      boxShadow: {
        soft: '0 10px 20px rgba(2, 6, 23, 0.08)',
        strong: '0 18px 40px rgba(2, 6, 23, 0.12)'
      },
      borderRadius: {
        brand: '14px'
      }
    },
  },
  plugins: [],
}
