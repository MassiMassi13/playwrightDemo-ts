import { APIRequestContext, expect } from "@playwright/test";

export class ProductsAPIPage {
  private request: APIRequestContext;
  private readonly baseURL = "https://automationexercise.com/api";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * 🔍 Appelle l'endpoint GET /productsList
   * @returns Un tableau de produits au format JSON
   */
  async getAllProducts() {
    // 🛰️ Envoi de la requête GET
    const response = await this.request.get(`${this.baseURL}/productsList`);

    // ✅ Vérifie que le code HTTP est 200 (succès)
    expect(response.status(), "✅ Code HTTP attendu 200").toBe(200);

    // 🧾 Parsing JSON
    const json = await response.json();

    // 🧪 Vérifie que la propriété "products" est bien présente
    expect(json, "❌ La réponse ne contient pas 'products'").toHaveProperty("products");

    // 🖨️ Log optionnel : Affiche le nombre de produits
    console.log(`📦 ${json.products.length} produits reçus.`);

    return json.products;
  }
}




//   **********************************meme chose sans trop de détails**********************************


// export class ProductsAPIPage {
//   readonly request: APIRequestContext;
//   private baseURL = "https://automationexercise.com/api";

//   constructor(request: APIRequestContext) {
//     this.request = request;
//   }

//   // 🔍 Appel API GET /productsList
//   async getAllProducts() {
//     const response = await this.request.get(`${this.baseURL}/productsList`);
//     expect(response.status()).toBe(200);

//     const json = await response.json();
//     expect(json).toHaveProperty("products");
//     return json.products;
//     console.log(" 📚 Voiçi la liste des produits : "+${json.products.length});
//   }
// }
