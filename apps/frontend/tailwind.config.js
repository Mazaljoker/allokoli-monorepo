/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: require("./src/styles/tokens/colors").colors,
      spacing: require("./src/styles/tokens/spacing").spacing,
      fontFamily: require("./src/styles/tokens/typography").typography.fontFamily,
      fontSize: require("./src/styles/tokens/typography").typography.fontSize,
      lineHeight: require("./src/styles/tokens/typography").typography.lineHeight,
    },
  },
  plugins: [],
};
