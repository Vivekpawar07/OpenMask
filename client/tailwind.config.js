/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom_black':'#151515',
        'custom_grey':"#2c2c2c",
        'custom_blue':'#3a6f98'
      }
    },
  },
  plugins: [],
}