/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CEFA89',
        secondary: '#F3F8F6',
        dark: '#05100E',
        light: '#FFFFFF'
      }
    },
  },
  plugins: [],
}