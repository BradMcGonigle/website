const baseConfig = require("configs.tailwind");
const typography = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Component packages - explicitly list to avoid node_modules scanning
    "../../packages/components/design-system/*/src/**/*.{ts,tsx}",
    "../../packages/components/layout/*/src/**/*.{ts,tsx}",
    "../../packages/components/content/*/src/**/*.{ts,tsx}",
    // Page packages
    "../../packages/pages/*/src/**/*.{ts,tsx}",
  ],
  plugins: [...(baseConfig.plugins || []), typography],
};
