import { expect, Locator, Page } from "@playwright/test";

export class RegisterPage {
  private page: Page;

  // Locators déclarés en tant qu'attributs
  private acceptCookiesBtn: Locator;
  private signupLinkOver: Locator;
  private signupLink: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private emailInput: Locator;
  private emailInputConfirm: Locator;
  private passwordInput: Locator;
  private submitButton: Locator;
  private consentCheckbox: Locator;
  private genderMrs: Locator;
  private genderMr: Locator;
  private dateOfBirthInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sélecteurs avancés robustes
    this.acceptCookiesBtn = page.getByText("Continuer sans accepter");
    this.signupLinkOver = page.getByRole("link", { name: "Se connecter" });
    this.signupLink = page.getByRole("link", {name: "Nouveau ? Inscrivez-vous"});
    this.emailInput = page.getByRole('textbox', { name: 'E-mail address', exact: true });
    this.emailInputConfirm = page.getByRole('textbox', { name: 'Confirm e-mail address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.genderMrs = page.getByText('Mrs');
    this.genderMr = page.getByText('Mr');
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.dateOfBirthInput = page.getByRole('textbox', { name: 'DD', exact: true })
    this.submitButton = page.getByRole('button', { name: 'Créer mon compte' });
    this.consentCheckbox = page.locator('#recaptcha-consent-checkbox');
  }

  async goTo() {
    await this.page.goto("https://www.rakuten.fr/");
  }

  async acceptCookiesIfPresent() {
    if (await this.acceptCookiesBtn.isVisible()) {
      await this.acceptCookiesBtn.click();
    }
  }

  async navigateToSignup() {
    await this.signupLinkOver.hover(); // Survol du lien "Se connecter"
    await this.signupLink.click(); // Cliquer sur "Nouveau ? Inscrivez-vous"
  }

  async fillForm(userData: {firstName: string;lastName: string;email: string; password: string;date: string }) {
    await this.emailInput.fill(userData.email);
    await this.page.mouse.wheel(0, 300);
    await this.emailInputConfirm.fill(userData.email);
    await this.page.waitForTimeout(600);
    await this.passwordInput.fill(userData.password);
    await this.page.waitForTimeout(300);
    await this.genderMrs.click();
    //await this.firstNameInput.pressSequentially(userData.firstName);
    await this.firstNameInput.focus();
    await this.page.keyboard.type(userData.firstName, { delay: 120 });
    await this.page.mouse.move(100, 200);
    //await this.lastNameInput.fill(userData.lastName);
    await this.lastNameInput.focus();
    await this.page.keyboard.type(userData.lastName, { delay: 120 });
    await this.page.mouse.click(400, 500);
    await this.dateOfBirthInput.pressSequentially(userData.date);
    console.log("voiçi les informations du user guest :" ,userData.email ," | ", userData.password," | ", userData.firstName," | ", userData.lastName )
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
