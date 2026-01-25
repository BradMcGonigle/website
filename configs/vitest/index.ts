import { defineConfig } from "vitest/config";

/**
 * Base Vitest configuration for utility packages
 */
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/**/*.test.{ts,tsx}"],
    },
  },
});
