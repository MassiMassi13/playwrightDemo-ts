import { Page, Locator, expect } from "@playwright/test";
import { getRandomElement } from "../../../utils/randomUtils";
import { Categories } from "../../../test-data/qa/categories";

export class ProductsAutoexePage {
  private searchProductField: Locator;
  private searchProductButon: Locator;
  private firstProduct: Locator;
  private premierProduct: Locator;
  private secondProduct: Locator;
  private continueShoppingButon: Locator;
  private AddProductMessage: Locator;
  private viewCart: Locator;
  private randomCategory: string = "";
  addedProductCategories: string[] = [];

  constructor(private page: Page) {
    this.searchProductField = page.getByRole("textbox", {
      name: "Search Product",
    });
    this.searchProductButon = page.getByRole("button", { name: "" });
    this.firstProduct = page.locator(".overlay-content > .btn").first();
    this.premierProduct = page.locator(".productinfo > .btn").first();
    this.secondProduct = page.locator(".productinfo > .btn").nth(1);

    this.AddProductMessage = page.getByText("Your product has been added");
    this.viewCart = page.getByRole("link", { name: "View Cart" });
    this.continueShoppingButon = page.locator("button[data-dismiss='modal']");
  }

  // getter
  get selectedCategory(): string {
    return this.randomCategory;
  }

  async fillFieldSearchProduct() {
    this.randomCategory = getRandomElement(Categories);
    await this.searchProductField.pressSequentially(this.randomCategory);
    console.log(" 🛒 la catégorie choisit est bien : ", this.randomCategory);
  }

  async ClickButonSearch() {
    await this.searchProductButon.click();
  }
  async clickOnFirstProduct() {
    await this.firstProduct.click();
  }
  async clickOnSecondProduct() {
    await this.secondProduct.click();
  }
  async clickOnPremierProduct() {
    await this.premierProduct.click();
  }
  async clickOnContinueShopping() {
    await this.continueShoppingButon.click();
  }

  async ExpectMessageProductAdded() {
    await expect(this.AddProductMessage).toBeVisible();
  }
  async goToViewCart() {
    await this.viewCart.click();
  }

  async verifyCart() {
    const temp = this.randomCategory;
    console.log(
      "⛳ Catégorie aléatoire choisie pour vérification dans le panier :",
      temp
    );

    const categoryElements = this.page.locator(
      "tbody > tr > td.cart_description > p"
    );
    const count = await categoryElements.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const categoryText = await categoryElements.nth(i).textContent();
      console.log(`🔍 Catégorie trouvée dans le panier : "${categoryText}"`);

      if (categoryText?.toLowerCase().includes(temp.toLowerCase())) {
        found = true;
        console.log(
          `✅ Correspondance trouvée : "${categoryText}" contient "${temp}"`
        );
        break;
      }
    }

    expect(found).toBeTruthy();
    console.log(
      `✅ Un produit contenant la catégorie "${temp}" a été trouvé dans le panier.`
    );
  }

  async verifyCar2() {
    // Si vous avez stocké les catégories des deux produits ajoutés
    const expectedCategories = this.addedProductCategories; // Array de 2 catégories
    console.log("⛳ Catégories attendues dans le panier :", expectedCategories);

    const categoryElements = this.page.locator(
      "tbody > tr > td.cart_description > p"
    );
    const count = await categoryElements.count();
    const foundCategories: string[] = [];

    // Récupérer toutes les catégories dans le panier
    for (let i = 0; i < count; i++) {
      const categoryText = await categoryElements.nth(i).textContent();
      console.log(`🔍 Catégorie trouvée dans le panier : "${categoryText}"`);

      if (categoryText) {
        foundCategories.push(categoryText.trim());
      }
      return count;
    }

    // Vérifier que chaque catégorie attendue est présente
    for (const expectedCat of expectedCategories) {
      const isFound = foundCategories.some((found) =>
        found.toLowerCase().includes(expectedCat.toLowerCase())
      );

      expect(isFound).toBeTruthy();
      console.log(`✅ Catégorie "${expectedCat}" trouvée dans le panier`);
    }

    console.log(
      `✅ Les ${expectedCategories.length} produits attendus sont présents dans le panier.`
    );
  }

  async verifyCartWithNumberOfProduct() {
    const categoryElements = this.page.locator("tbody > tr > td.cart_description > p");
    const count = await categoryElements.count();

    // Vérifier qu'il y a au moins 1 produit dans le panier
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Le panier contient ${count} produit(s)`);

    // Vérifier chaque produit dans le panier
    for (let i = 0; i < count; i++) {
      const category = await categoryElements.nth(i).textContent();
      console.log(`🔍 Produit ${i + 1}: ${category}`);

      // Vérifier que la catégorie a un format valide (contient ">")
      expect(category).toContain(">");

      // Vérifier que la catégorie n'est pas vide
      expect(category?.trim().length).toBeGreaterThan(0);
    }

    console.log(`✅ Tous les ${count} produits ont des catégories valides`);
  }

  
}
