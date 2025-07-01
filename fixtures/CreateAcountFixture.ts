import { test as base } from "@playwright/test";
import { LoginAutoexePage } from "../src/page-objects/automationExe/e2e/LoginAutoexePage";
import { SignupAutoexePage } from "../src/page-objects/automationExe/e2e/SignupAutoexePage";

type Fixtures = {
  loginAutoexePage: LoginAutoexePage;
  signupAutoexePage : SignupAutoexePage;
};

export const test = base.extend<Fixtures>({
  loginAutoexePage: async ({ page }, use) => {
    const loginPage = new LoginAutoexePage(page);
    await use(loginPage);
  },

  signupAutoexePage: async ({ page }, use) => {
    const instance = new SignupAutoexePage(page);
    await use(instance);
  },
});
