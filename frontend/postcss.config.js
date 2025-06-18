// postcss.config.js
export default {
  plugins: {
    // Change this line:
    // tailwindcss: {},
    // To this:
    '@tailwindcss/postcss': {}, // Use the new package
    autoprefixer: {},
  },
}