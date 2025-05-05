// tailwind.config.js

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#222831',
        grey: '#393E46',
        darkbeige: '#948979',
        beige: '#DFD0B8',
      },
      boxShadow: {
        'light': '0px 4px 6px rgba(0, 0, 0, 0.1)',
        'dark': '0px 6px 10px rgba(0, 0, 0, 0.2)',
        'custom': '0px 4px 6px rgba(57, 62, 70, 0.2)',
      },
    },
  },
  plugins: [],
}
