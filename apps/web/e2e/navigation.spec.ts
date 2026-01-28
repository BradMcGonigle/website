import { test, expect } from "@playwright/test";

/**
 * Navigation tests verify links work and users can move between pages.
 * Focus on critical user flows, not exhaustive link checking.
 */

test.describe("Navigation", () => {
  test("can navigate from home to about via header", async ({ page }) => {
    await page.goto("/");

    // Click About link in navigation
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "About" })
      .click();

    // Verify navigation succeeded
    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  });

  test("can navigate from about to home via header", async ({ page }) => {
    await page.goto("/about");

    // Click Home link in navigation
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Home" })
      .click();

    // Verify navigation succeeded
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Hi, I'm Brad."
    );
  });

  test("logo links to home", async ({ page }) => {
    await page.goto("/about");

    // Click logo
    await page.getByRole("banner").getByRole("link", { name: "BM" }).click();

    // Verify navigation succeeded
    await expect(page).toHaveURL("/");
  });

  test("skip to content link works", async ({ page }) => {
    await page.goto("/");

    // Tab to reveal skip link
    await page.keyboard.press("Tab");

    // Verify skip link is now visible and focused
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();

    // Activate the skip link
    await page.keyboard.press("Enter");

    // Verify focus moved to main content
    await expect(page.locator("#main-content")).toBeFocused();
  });
});
