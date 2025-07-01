import { test as base } from "@playwright/test";
import { APIClient } from "../src/utils/api-client";
import { LoginAutoexePage } from "../src/page-objects/automationExe/e2e/LoginAutoexePage";
import { HomeAutoexePage } from "../src/page-objects/automationExe/e2e/HomeAutoexePage";
import { PaymentAutoexePage } from "../src/page-objects/automationExe/e2e/PaymentAutoexePage";
import { CartAutoexePage } from "../src/page-objects/automationExe/e2e/CartAutoexePage";
import { ProductsAutoexePage } from "../src/page-objects/automationExe/e2e/ProductsAutoexePage";

type Fixtures = {
  user: { email: string; password: string };
  loginAutoexePage: LoginAutoexePage;
  homeAutoexePage: HomeAutoexePage;
  paymentAutoexePage: PaymentAutoexePage;
  cartAutoexePage: CartAutoexePage;
  productsAutoexePage: ProductsAutoexePage;
};

export const test = base.extend<Fixtures>({
  user: async ({}, use) => {
    const api = new APIClient();
    const user = await api.createTestUser();
    await use(user);
  },

  loginAutoexePage: async ({ page }, use) => {
    const instance = new LoginAutoexePage(page);
    await use(instance);
  },

  homeAutoexePage: async ({ page }, use) => {
    const instance = new HomeAutoexePage(page);
    await use(instance);
  },

  paymentAutoexePage: async ({ page }, use) => {
    const instance = new PaymentAutoexePage(page);
    await use(instance);
  },

  cartAutoexePage: async ({ page }, use) => {
    const instance = new CartAutoexePage(page);
    await use(instance);
  },

  productsAutoexePage: async ({ page }, use) => {
    const instance = new ProductsAutoexePage(page);
    await use(instance);
  },

});

export { expect } from "@playwright/test";
