import { defineConfig, devices } from '@playwright/test';


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 
  [
    ["html"], // Rapport HTML
    ["json", { outputFile: "test-results.json" }], // Rapport JSON
    ["allure-playwright", {
      detail: true,   // <-- garde les étapes personnalisées (test.step()) mais masque les hooks Playwright
      outputFolder: 'allure-results',
      suiteTitle: false,            // <-- désactive les noms de fichier .spec.ts
      stripANSIControlSequences: true,     //  <-- nettoie les caractères spéciaux dans le terminal Allure
    }], // Rapport Allure
    
      //["./src/utils/Reporter.ts"],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
     baseURL: process.env.BASE_URL || "https://opensource-demo.orangehrmlive.com/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // Capturer des vidéos uniquement en cas d'échec
    video: 'retain-on-failure', //ou 'retain-on-failure' pour conserver la vidéo lors de tous les échecs

    // Capturer des captures d'écran uniquement en cas d'échec
    screenshot: 'only-on-failure',
    //  indispensable en CI.
    //headless: true, 
    // Headless en CI, visible en local
    headless: process.env.CI ? true : false, 

    //viewport: { width: 1280, height: 720 },

    //  Contournement détection bot
    launchOptions: {
      args: [
       '--start-maximized',
       '--disable-blink-features=AutomationControlled',
       '--no-sandbox',
       '--disable-setuid-sandbox',
      ],
    },

    //  Imitation d'un vrai navigateur 🧠
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: true,

  },

  /* Configure projects for major browsers */
  projects: [
    {
      // name: 'chromium',
      // use: { ...devices['Desktop Chrome'] },
      //name: 'Tests', // ← Ce nom neutre sera affiché dans Allure (ou ne mets rien si un seul projet)
      use: { browserName: 'chromium' },
    },
  /** 
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
