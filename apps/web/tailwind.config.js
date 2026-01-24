const baseConfig = require("configs.tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/**/*.{js,ts,jsx,tsx}",
  ],
};
