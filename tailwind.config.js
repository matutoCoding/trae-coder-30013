/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        xuan: {
          paper: '#F5F0E8',
          paperLight: '#FAF7F0',
          paperDark: '#E8E0D0',
          ink: '#2C2C2C',
          inkLight: '#5A5A5A',
          ochre: '#8B4513',
          ochreLight: '#A0522D',
          ochreDark: '#6B3410',
          indigo: '#4A6FA5',
          indigoLight: '#6B8EC4',
          moss: '#6B8E6B',
          mossLight: '#8FB88F',
          cinnabar: '#C23B22',
          gold: '#C9A84C',
          silver: '#9CA3AF',
          bronze: '#CD7F32',
        }
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
