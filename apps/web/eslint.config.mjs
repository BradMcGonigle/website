import config from "configs.eslint/nextjs.mjs";

export default [
  { ignores: [".velite/**", "velite.config.ts"] },
  ...config,
];
