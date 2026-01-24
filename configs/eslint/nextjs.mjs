import nextPlugin from "eslint-config-next";
import baseConfig from "./base.mjs";

export default [
  ...baseConfig,
  ...nextPlugin,
  {
    rules: {
      // Next.js specific rules can be added here
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
