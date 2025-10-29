/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: '#1db954',
        'spotify-hover': '#1ed760',
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '2/3': '2 / 3',
      },
    },
  },
  plugins: [],
}
