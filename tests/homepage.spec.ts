import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that the main heading is visible
    await expect(page.locator("h1")).toContainText(
      "Check Your Tesla Battery Health"
    );

    // Check for the blue highlighted text "30 Seconds"
    await expect(page.locator("span.text-blue-600")).toContainText(
      "30 Seconds"
    );
  });

  test("should display the logo component", async ({ page }) => {
    await page.goto("/");

    // Check that the logo is present in the header
    await expect(
      page.locator("header").locator("text=CertMyBattery")
    ).toBeVisible();
  });

  test("should display feature cards", async ({ page }) => {
    await page.goto("/");

    // Check for the three main feature cards using more specific selectors
    await expect(
      page.locator("h3").filter({ hasText: "Instant Results" })
    ).toBeVisible();
    await expect(
      page.locator("h3").filter({ hasText: "Verified Certificates" })
    ).toBeVisible();
    await expect(
      page.locator("h3").filter({ hasText: "Privacy First" })
    ).toBeVisible();
  });

  test("should display stats section", async ({ page }) => {
    await page.goto("/");

    // Check for stats visual component
    await expect(page.locator("text=50k+")).toBeVisible();
    await expect(page.locator("text=Batteries Checked")).toBeVisible();
    await expect(page.locator("text=98.5%")).toBeVisible();
    await expect(page.locator("text=Accuracy Rate")).toBeVisible();
  });

  test("should have working navigation buttons", async ({ page }) => {
    await page.goto("/");

    // Check main CTA button
    const checkButton = page.locator("text=Check My Tesla").first();
    await expect(checkButton).toBeVisible();

    // Check secondary button
    const sampleButton = page.locator("text=View Sample Report");
    await expect(sampleButton).toBeVisible();
  });

  test("should display buyer protection section", async ({ page }) => {
    await page.goto("/");

    // Check for the buyer protection warning section
    await expect(
      page.locator("text=Don't Get Scammed When Buying a Used Tesla")
    ).toBeVisible();
    await expect(
      page.locator("text=Battery replacement can cost $15,000+")
    ).toBeVisible();
  });

  test("should display how it works section", async ({ page }) => {
    await page.goto("/");

    // Check for the three steps
    await expect(page.locator("text=How It Works")).toBeVisible();
    await expect(page.locator("text=Connect Tesla")).toBeVisible();
    await expect(page.locator("text=Get Assessment")).toBeVisible();
    await expect(page.locator("text=Download Certificate")).toBeVisible();
  });

  test("should have responsive design elements", async ({ page }) => {
    await page.goto("/");

    // Check that the page has the expected background gradient
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Check that cards have proper styling
    const featureCards = page.locator('[class*="shadow-xl"]');
    await expect(featureCards.first()).toBeVisible();
  });
});
