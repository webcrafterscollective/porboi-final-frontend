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
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        secondary: {
          500: '#10b981',
          600: '#059669',
        },
        'literary-maroon': '#8C1818', // A deep, classic red for accents
      },
      fontFamily: {
        serif: ['Noto Serif Bengali', 'Georgia', 'serif'], // Bengali Serif for headings
        sans: ['Hind Siliguri', 'Inter', 'sans-serif'],    // Bengali Sans-serif for body
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}