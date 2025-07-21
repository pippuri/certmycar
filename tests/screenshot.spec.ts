import { test } from "@playwright/test";

test("capture homepage screenshot", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Wait for the page to load completely
  await page.waitForLoadState("networkidle");

  // Take a full page screenshot
  await page.screenshot({
    path: "homepage-styled.png",
    fullPage: true,
  });
});
