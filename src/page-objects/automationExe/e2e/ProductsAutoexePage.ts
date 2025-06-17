import { Page, Locator, expect } from "@playwright/test";
import { getRandomElement } from "../../../utils/randomUtils";
import { categories } from "../../../test-data/qa/Categories";

export class ProductsAutoexePage {
  private searchProductField: Locator;
  private searchProductButon: Locator;
  private firstProduct: Locator;
  private AddProductMessage: Locator;
  private viewCart: Locator;
  private randomCategory: string = "";

  constructor(private page: Page) {
    this.searchProductField = page.getByRole("textbox", {name: "Search Product" });
    this.searchProductButon = page.getByRole("button", { name: "" });
    this.firstProduct = page.locator('.overlay-content > .btn').first();
    this.AddProductMessage = page.getByText('Your product has been added');
    this.viewCart = page.getByRole('link', { name: 'View Cart' });
  }

  // getter
  get selectedCategory(): string {
    return this.randomCategory;
  }

  async fillFieldSearchProduct() {
    this.randomCategory = getRandomElement(categories);
    await this.searchProductField.pressSequentially(this.randomCategory);
    console.log(" 🛒 la catégorie choisit est bien : ",this.randomCategory);
  }

  async ClickButonSearch() {
    await this.searchProductButon.click();
  }
  async clickOnFirstProduct(){
    await this.firstProduct.click();
  }

  async ExpectMessageProductAdded(){
    await expect (this.AddProductMessage).toBeVisible();
  }
  async goToViewCart(){
    await this.viewCart.click();
  }
  
  async verifyCart() {
    const temp = this.randomCategory;
    console.log("⛳ Catégorie aléatoire choisie pour vérification dans le panier :", temp);
 
    const categoryElements = this.page.locator("tbody > tr > td.cart_description > p");
    const count = await categoryElements.count();
    let found = false;
  
    for (let i = 0; i < count; i++) {
      const categoryText = await categoryElements.nth(i).textContent();
      console.log(`🔍 Catégorie trouvée dans le panier : "${categoryText}"`);
      
      if (categoryText?.toLowerCase().includes(temp.toLowerCase())) {
        found = true;
        console.log(`✅ Correspondance trouvée : "${categoryText}" contient "${temp}"`);
        break;
      }
    }
  
    expect(found).toBeTruthy();
    console.log(`✅ Un produit contenant la catégorie "${temp}" a été trouvé dans le panier.`);
  }
}
