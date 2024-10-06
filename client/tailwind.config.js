/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors:{
        'custom_black':'#151515',
        'custom_grey':"#2c2c2c",
        'custom_blue':'#3a6f98'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite', // Slower spinning animation
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false, // Disable DaisyUI themes to prevent conflicts
  },
}