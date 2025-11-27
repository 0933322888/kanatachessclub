/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        whisky: {
          50: '#FAF7F2',
          100: '#F5E6D3',
          200: '#E8D4B8',
          300: '#D4AF37',
          400: '#B8860B',
          500: '#8B6914',
          600: '#6B4E1F',
          700: '#5C3A1A',
          800: '#3D2817',
          900: '#2C1810',
        },
        amber: {
          light: '#F5E6D3',
          DEFAULT: '#D4AF37',
          dark: '#B8860B',
        },
        burgundy: {
          light: '#A0522D',
          DEFAULT: '#722F37',
          dark: '#5C1A1F',
        },
      },
    },
  },
  plugins: [],
}

