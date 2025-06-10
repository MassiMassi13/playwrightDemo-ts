import { test as base, expect, chromium } from '@playwright/test';
import { RegisterPage } from '../src/page-objects/Raka/RegisterPage';
import { DataFactory } from '../src/utils/DataFactory';

const test = base.extend<{ page: any }>({
  page: async ({}, use) => {
    const browser = await chromium.launch({
      headless: process.env.CI ? true : false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      javaScriptEnabled: true,
    });

    const page = await context.newPage();
    await use(page);
    await browser.close();
  },
});

test('Créer un compte visiteur Rakuten', async ({ page }) => {
  const visitorPage = new RegisterPage(page);
  const userData = DataFactory.generateUser();

  await visitorPage.goTo();
  await visitorPage.acceptCookiesIfPresent();
  await visitorPage.navigateToSignup();
  await page.mouse.move(300, 400, { steps: 15 }); // mouvement lent
  await page.waitForTimeout(200);
  await page.pause();
  await page.keyboard.press('Tab');
  await visitorPage.fillForm(userData);
  await visitorPage.submitForm();
  await page.pause();

  //await expect(page.locator('text=Bienvenue')).toBeVisible();
});
