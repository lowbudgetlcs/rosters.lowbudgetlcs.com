/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        surface: '#121212',
        'surface-100': '#282828',
        'surface-200': '#3f3f3f',
        'surface-300': '#575757',
        'surface-400': '#717171',
        'surface-500': '#ABABAB',
        primary: '#FFC107',
        'primary-100': '#FFC83b',
        'primary-200': '#FFCE58',
        'primary-300': '#FFD572',
        'primary-400': '#FFDC8A',
        'primary-500': '#FFE3A2'

      }
    },
  },
  plugins: [],
}

