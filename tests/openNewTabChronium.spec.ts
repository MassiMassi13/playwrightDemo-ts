import test, { chromium, expect } from "@playwright/test";

test("Ouvrir un vounel onglet avec playwright", async ({}) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page1 = await context.newPage();

  await page1.goto("https://google.com");

  const page2 = await context.newPage();
  await page2.goto("https://playwright.dev");
  await expect(page2).toHaveTitle(
    "Fast and reliable end-to-end testing for modern web apps | Playwright"
  );
});
