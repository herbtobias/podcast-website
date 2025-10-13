/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-bg': '#070911',
        'card-bg': '#0b1022',
      },
      fontFamily: {
        'compress': ['CompressaPRO-GX', 'Bricolage Grotesque', 'Inter', 'Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
