import { test as base } from '@playwright/test';
import { APIClient } from '../src/utils/api-clients';
import { LoginAutoexePage } from '../src/page-objects/automationExe/LoginAutoexePage';

type UserFixture = {
  user: { email: string; password: string };
  loginAutoexePage: LoginAutoexePage;
};

export const test = base.extend<UserFixture>({
  user: async ({}, use) => {
    const api = new APIClient();
    const user = await api.createTestUser(); // méthode custom qui retourne { email, password }
    await use(user);
    // Tu peux ici faire un cleanup si nécessaire, comme :
    // await api.deleteUser(user.email);
  },

  loginAutoexePage: async ({ page }, use) => {
    const loginAutoexePage = new LoginAutoexePage(page);
    await use(loginAutoexePage);
  }
});
