/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7ff',
          100: '#b3e9ff',
          200: '#80dbff',
          300: '#4dcdff',
          400: '#26c1ff',
          500: '#38b6ff',
          600: '#0099e6',
          700: '#0077b3',
          800: '#005580',
          900: '#003d5c',
        },
      },
    },
  },
  plugins: [],
}

