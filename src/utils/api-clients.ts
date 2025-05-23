import axios from 'axios';

export class APIClient {
  private baseURL = 'https://automationexercise.com/api'; // hypotétique

  async createTestUser() {
    const randomEmail = `massimassi@yopmail.com`;
    const password = 'Test123';

    // ⚠️ Le site n'a pas de vraie API publique, cette URL est fictive
    await axios.post(`${this.baseURL}/createAccount`, {
      name: 'Playwright Test',
      email: randomEmail,
      password,
    });

    return { email: randomEmail, password };
  }
}
