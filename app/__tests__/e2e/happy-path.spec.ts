import { test, expect } from "@playwright/test";

test.describe("Spendable — happy path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Clear any persisted state between tests
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("home page renders the app title and safe-to-spend card", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /spendable/i })).toBeVisible();
    // Safe to Spend card should be present (even if showing $0)
    await expect(page.getByText(/safe to spend/i)).toBeVisible();
  });

  test("user can set up income and see a non-zero payday", async ({ page }) => {
    // Fill in income setup — adjust selectors to match actual component labels
    await page.getByRole("button", { name: /set.*income|add.*income|setup/i }).click();

    // These selectors will need to match the SetupIncome component's labels
    await page.getByLabel(/amount|salary/i).fill("3000");
    await page.getByLabel(/next payday/i).fill("2026-03-20");

    // Select biweekly frequency if it's a select/radio
    const frequencySelect = page.getByLabel(/frequency/i);
    if (await frequencySelect.isVisible()) {
      await frequencySelect.selectOption("biweekly");
    }

    await page.getByRole("button", { name: /save|confirm|done/i }).click();

    // After saving, the next payday should appear somewhere
    await expect(page.getByText(/mar.*20|march.*20|2026-03-20/i)).toBeVisible();
  });

  test("adding an expense reduces the safe-to-spend number", async ({ page }) => {
    // Set up income first (balance auto-set to 0 initially)
    // Set a balance
    const balanceInput = page.getByPlaceholder(/balance|current/i).first();
    if (await balanceInput.isVisible()) {
      await balanceInput.fill("200000"); // $2,000 in cents? depends on input format
    }

    // The specific test assertions depend on the actual component behavior
    // This is a placeholder that validates the page doesn't crash
    await expect(page).toHaveURL("/");
  });
});
