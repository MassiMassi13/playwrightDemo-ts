import { Page, Locator, expect } from "@playwright/test";

export class HomeAutoexePage {
  private home: Locator;
  private products: Locator;
  private cart: Locator;
  private logout: Locator;
  private deleteAccount: Locator;
  private testCases: Locator;
  private apiTesting: Locator;
  private videoTutorials: Locator;
  private contactUs: Locator;
 

  constructor(private page: Page) {
    this.home = page.locator('input[data-qa="login-email"]');
    this.products = page.getByRole('listitem').filter({ hasText: 'Products' });
    this.cart = page.getByRole('listitem').filter({ hasText: 'Cart' });
    this.logout = page.getByRole('listitem').filter({ hasText: 'Logout' });
    this.deleteAccount = page.getByRole('listitem').filter({ hasText: 'Delete Account' });
    this.testCases = page.getByRole('listitem').filter({ hasText: 'Test Cases' });
    this.apiTesting = page.getByRole('listitem').filter({ hasText: 'API Testing' });
    this.videoTutorials = page.getByRole('listitem').filter({ hasText: 'Video Tutorials' });
    this.contactUs = page.getByRole('listitem').filter({ hasText: 'Contact us' });
    
  }


  async clickOnProductsLink(){
    await this.products.click();
    
  }
  async clickOnCartLink(){

  }
  async clickOnLogoutLink(){

  }
  async clickOnDeleteAccountLink(){

  }
  async clickOnTestCasesLink(){

  }
  async clickOnApiTestingLink(){

  }
  async clickOnVideoTutorialsLink(){

  }
  async clickOnContactUsLink(){

  }

}
