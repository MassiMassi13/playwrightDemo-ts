import test, { chromium, expect } from "@playwright/test";

test("Ouvrir une nouvelle fenêtre avec playwright", async ({}) => {
  const browser = await chromium.launch(); // mode non-headless pour visualiser
  // Première fenêtre
  const context1 = await browser.newContext();
  const window1 = await context1.newPage();
  await window1.goto("https://google.com");

  // Deuxième fenêtre (nouveau contexte)
  const context2 = await browser.newContext();
  const window2 = await context2.newPage();
  await window2.goto("https://playwright.dev");

  await expect(window2).toHaveTitle(
    "Fast and reliable end-to-end testing for modern web apps | Playwright"
  );

  await browser.close();
});
