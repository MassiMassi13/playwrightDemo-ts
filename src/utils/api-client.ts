import axios from "axios";
import { APIRequestContext, request } from "@playwright/test";

export class APIClient {
  private baseURL = "https://automationexercise.com/api"; // hypotétique

  async createTestUser() {
    const randomEmail = `massimassi@yopmail.com`;
    const password = "Test123";

    // ⚠️ Le site n'a pas de vraie API publique, cette URL est fictive
    await axios.post(`${this.baseURL}/createAccount`, {
      name: "Playwright Test",
      email: randomEmail,
      password,
    });

    return { email: randomEmail, password };
  }

  async createAPIClient(): Promise<APIRequestContext> {
    return await request.newContext({
      baseURL: "https://automationexercise.com/api",
      extraHTTPHeaders: {
        "Content-Type": "application/json",
      },
    });
  }
}
