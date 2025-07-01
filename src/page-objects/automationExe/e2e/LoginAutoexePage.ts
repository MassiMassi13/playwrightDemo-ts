import { Page , Locator, expect} from '@playwright/test';
import  {getRandomElement} from '../../../utils/randomUtils'

export class LoginAutoexePage {

    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private logoutLink: Locator;
    private loginErrorMessage: Locator;
    private NameSignup :Locator;
    private emailSignup : Locator;
    private signupButton: Locator;
    
  
    constructor(private page: Page) {
      
      this.emailInput = page.locator('input[data-qa="login-email"]');
      this.passwordInput = page.locator('input[data-qa="login-password"]');
      this.loginButton = page.locator('button[data-qa="login-button"]');
      this.logoutLink = page.locator('a[href="/logout"]');
      this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
      this.NameSignup = page.locator('input[data-qa="signup-name"]');
      this.emailSignup = page.locator('input[data-qa="signup-email"]');
      this.signupButton = page.locator('button[data-qa="signup-button"]');
      
    }
 
    async goto() {
      await this.page.goto('https://automationexercise.com/login');
      await expect(this.emailInput).toBeVisible();
      await expect(this.emailSignup).toBeVisible();
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
  
    async signup(name: string, email: string){
    
      await this.NameSignup.fill(name);
      await this.emailSignup.fill(email)
      await this.signupButton.click();
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
  