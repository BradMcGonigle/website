import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for React component packages
 */
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/**/*.test.{ts,tsx}", "vitest.setup.ts"],
    },
  },
});
