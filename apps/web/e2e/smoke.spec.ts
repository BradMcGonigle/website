import { test, expect } from "@playwright/test";

/**
 * Smoke tests verify the application loads and critical elements are present.
 * These should be fast, stable, and catch major breakages.
 */

test.describe("Smoke Tests", () => {
  test("home page loads with correct content", async ({ page }) => {
    await page.goto("/");

    // Page loaded
    await expect(page).toHaveTitle("Brad McGonigle");

    // Critical content visible
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Hi, I'm Brad."
    );

    // Layout elements present
    await expect(page.getByRole("banner")).toBeVisible(); // header
    await expect(page.getByRole("contentinfo")).toBeVisible(); // footer
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("about page loads with correct content", async ({ page }) => {
    await page.goto("/about");

    // Page loaded
    await expect(page).toHaveTitle(/About/);

    // Critical content visible
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");

    // Layout elements present
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("changelog page loads with correct content", async ({ page }) => {
    await page.goto("/changelog");

    // Page loaded
    await expect(page).toHaveTitle(/Changelog/);

    // Critical content visible
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Changelog"
    );

    // Semantic structure - changelog uses article for content
    await expect(page.getByRole("article")).toBeVisible();

    // Layout elements present
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    // At least one changelog entry should be visible
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });
});
