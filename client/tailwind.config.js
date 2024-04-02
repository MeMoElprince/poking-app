/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9837F9',
        background1: '#202020',
        background2: '#2C2C2C',
        white: '#F5F5F5',
        black: '#000000',
        gray: '#9A9A9A',
      },
      height: {
        'screen': '100dvh',
      },
      screens:{
        main: '900px',
      }
    },
  },
  plugins: [],
}

