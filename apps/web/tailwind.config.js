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
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(51 65 85)", // slate-700
            "--tw-prose-headings": "rgb(15 23 42)", // slate-900
            "--tw-prose-lead": "rgb(71 85 105)", // slate-600
            "--tw-prose-links": "rgb(15 23 42)", // slate-900
            "--tw-prose-bold": "rgb(15 23 42)", // slate-900
            "--tw-prose-counters": "rgb(100 116 139)", // slate-500
            "--tw-prose-bullets": "rgb(203 213 225)", // slate-300
            "--tw-prose-hr": "rgb(226 232 240)", // slate-200
            "--tw-prose-quotes": "rgb(15 23 42)", // slate-900
            "--tw-prose-quote-borders": "rgb(226 232 240)", // slate-200
            "--tw-prose-captions": "rgb(100 116 139)", // slate-500
            "--tw-prose-code": "rgb(15 23 42)", // slate-900
            "--tw-prose-pre-code": "rgb(226 232 240)", // slate-200
            "--tw-prose-pre-bg": "rgb(30 41 59)", // slate-800
            "--tw-prose-th-borders": "rgb(203 213 225)", // slate-300
            "--tw-prose-td-borders": "rgb(226 232 240)", // slate-200
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [...(baseConfig.plugins || []), typography],
};
