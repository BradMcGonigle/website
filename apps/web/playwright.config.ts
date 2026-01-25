import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration optimized for stability and speed.
 *
 * Principles:
 * - Single browser (Chromium) - less maintenance, faster CI
 * - Strict timeouts - fail fast, don't wait forever
 * - No retries locally - find flaky tests early
 * - Minimal retries in CI - mask transient issues only
 * - Parallel execution - maximize speed
 * - Artifacts only on failure - reduce noise
 */

const isCI = !!process.env.CI;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",

  // Fail fast: stop on first failure locally, continue in CI for full report
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  ...(isCI && { workers: 2 }),

  // Reporter: minimal locally, full in CI
  reporter: isCI ? [["html", { open: "never" }], ["github"]] : "list",

  // Global settings for stability
  use: {
    baseURL,

    // Strict timeouts - fail fast
    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    // Consistent viewport
    viewport: { width: 1280, height: 720 },

    // Capture artifacts only on failure
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",

    // Reduce flakiness
    locale: "en-US",
    timezoneId: "America/New_York",
  },

  // Single browser - Chromium covers 99% of issues
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Start Next.js server for tests
  webServer: {
    command: "pnpm run build && pnpm run start",
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },

  // Output directory for test artifacts
  outputDir: "e2e-results",

  // Global timeout per test
  timeout: 30_000,

  // Expect timeout
  expect: {
    timeout: 5_000,
  },
});
