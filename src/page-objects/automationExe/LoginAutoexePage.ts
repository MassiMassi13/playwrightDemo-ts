import { Page , Locator, expect} from '@playwright/test';

export class LoginAutoexePage {

    // Déclaration des éléments de la page
    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private logoutLink: Locator;
    private loginErrorMessage: Locator;
  
    constructor(private page: Page) {
      // Initialisation des locators dans le constructeur
      this.emailInput = page.locator('input[data-qa="login-email"]');
      this.passwordInput = page.locator('input[data-qa="login-password"]');
      this.loginButton = page.locator('button[data-qa="login-button"]');
      this.logoutLink = page.locator('a[href="/logout"]');
      this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
    }
  
    // Navigation vers la page de login
    async goto() {
      await this.page.goto('https://automationexercise.com/login');
      await expect(this.emailInput).toBeVisible();
    }
    async acceptCockies(){
      await this.page.locator('button.fc-cta-consent:has-text("Consent")').click({ timeout: 3000 }).catch(() => {});

    }
  
    // Connexion avec les identifiants
    async login(email: string, password: string) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
  
    // Vérification du succès de la connexion
    async expectLoginSuccess() {
      await this.logoutLink.waitFor({ state: 'visible' });
      await expect(this.logoutLink).toBeVisible();
    }
  
    // Vérification de l’échec de la connexion
    async expectLoginFail() {
      await expect(this.loginErrorMessage).toBeVisible();
    }
  }
  