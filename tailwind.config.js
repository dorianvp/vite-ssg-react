const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Lato"', ...defaultTheme.fontFamily.sans],
        'serif': ['"Merriweather"', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        'blue': '#3451B2',
        'black': '#2F2D29',
        'white': '#E0DCD5',
        'gray': '#CFCAC0',
        'info': '#3451B2'
      },
      width: ({ theme }) => ({
        'xl': theme('maxWidth.xl'),
        '2xl': theme('maxWidth.2xl')
      })
    }
  },
  plugins: [],
}

