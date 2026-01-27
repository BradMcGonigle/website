import { test, expect } from "@playwright/test";

/**
 * Theme toggle tests verify dark mode functionality works correctly.
 * Tests cover switching themes, persistence, and system preference detection.
 */

test.describe("Theme Toggle", () => {
  test("can switch to dark mode", async ({ page }) => {
    await page.goto("/");

    // Find the theme toggle by its radiogroup role
    const themeToggle = page.getByRole("radiogroup", { name: "Select theme" });
    await expect(themeToggle).toBeVisible();

    // Click dark mode button
    await themeToggle.getByRole("radio", { name: "Dark" }).click();

    // Verify dark class is applied to html element
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("can switch to light mode", async ({ page }) => {
    await page.goto("/");

    const themeToggle = page.getByRole("radiogroup", { name: "Select theme" });

    // Switch to dark first, then light
    await themeToggle.getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await themeToggle.getByRole("radio", { name: "Light" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("theme persists after page refresh", async ({ page }) => {
    await page.goto("/");

    // Switch to dark mode
    const themeToggle = page.getByRole("radiogroup", { name: "Select theme" });
    await themeToggle.getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Refresh the page
    await page.reload();

    // Verify dark mode persists
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Verify the dark button is still selected
    await expect(
      page
        .getByRole("radiogroup", { name: "Select theme" })
        .getByRole("radio", { name: "Dark" })
    ).toHaveAttribute("aria-checked", "true");
  });

  test("system mode respects OS dark preference", async ({ page }) => {
    // Emulate dark color scheme preference
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    // Switch to system mode
    const themeToggle = page.getByRole("radiogroup", { name: "Select theme" });
    await themeToggle.getByRole("radio", { name: "System" }).click();

    // Verify dark class is applied (respecting system preference)
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("system mode respects OS light preference", async ({ page }) => {
    // Emulate light color scheme preference
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    // Switch to system mode
    const themeToggle = page.getByRole("radiogroup", { name: "Select theme" });
    await themeToggle.getByRole("radio", { name: "System" }).click();

    // Verify dark class is NOT applied (respecting system preference)
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
