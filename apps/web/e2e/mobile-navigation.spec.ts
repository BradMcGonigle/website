import { test, expect } from "@playwright/test";

/**
 * Mobile navigation tests verify the hamburger menu works correctly
 * on smaller screen sizes.
 */

test.describe("Mobile Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test("hamburger menu button is visible on mobile", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: "Open menu" });
    await expect(menuButton).toBeVisible();
  });

  test("hamburger menu button is hidden on desktop", async ({ page }) => {
    // Reset to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    // Use CSS locator since getByRole excludes hidden elements
    const menuButton = page.locator("button", { hasText: "Open menu" });
    await expect(menuButton).toBeHidden();
  });

  test("opens mobile menu when hamburger button is clicked", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();

    // Mobile navigation should be visible
    const mobileNav = page.getByRole("navigation", {
      name: "Mobile navigation",
    });
    await expect(mobileNav).toBeVisible();

    // Button should now show close state (name changed to "Close menu")
    const closeButton = page.getByRole("button", { name: "Close menu" });
    await expect(closeButton).toHaveAttribute("aria-expanded", "true");
  });

  test("closes mobile menu when close button is clicked", async ({ page }) => {
    await page.goto("/");

    // Open the menu
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" })
    ).toBeVisible();

    // Close the menu
    await page.getByRole("button", { name: "Close menu" }).click();

    // Use CSS locator to check hidden state (element removed from DOM)
    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(mobileNav).toBeHidden();
  });

  test("can navigate using mobile menu", async ({ page }) => {
    await page.goto("/");

    // Open mobile menu
    await page.getByRole("button", { name: "Open menu" }).click();

    // Click About link in mobile navigation
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "About" })
      .click();

    // Verify navigation succeeded
    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  });

  test("mobile menu closes after navigation", async ({ page }) => {
    await page.goto("/");

    // Open mobile menu
    await page.getByRole("button", { name: "Open menu" }).click();

    // Click About link
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "About" })
      .click();

    // After navigation, mobile menu should be closed (removed from DOM)
    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(mobileNav).toBeHidden();
  });

  test("desktop navigation is hidden on mobile", async ({ page }) => {
    await page.goto("/");

    // Use CSS locator since getByRole excludes hidden elements
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).toBeHidden();
  });
});
