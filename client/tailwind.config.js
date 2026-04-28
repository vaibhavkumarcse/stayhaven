/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1b6fb',
          400: '#6d89f7',
          500: '#4f46e5', // Brand Indigo
          600: '#4338ca',
          700: '#3730a3',
          800: '#312e81',
          900: '#1e1b4b',
        },
        brand: '#5850ec',
        accent: '#06b6d4',
        dark: '#050505',
        surface: {
          DEFAULT: '#121212',
          lighter: '#1e1e1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.10)',
        nav:  '0 1px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
