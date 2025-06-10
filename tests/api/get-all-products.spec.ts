import { test, expect, request } from "@playwright/test";
import { ProductsAPIPage } from "../../src/page-objects/automationExe/api/ProductsAPIPage";
import { expectedProductKeys } from "../../src/test-data/qa/api/products.fixture";
import { AllureUtils } from "../../src/utils/allure.utils";

// 🎯 Test principal : récupération et validation des produits
test("🧪 API - Obtenir Tous les Produits - devrait retourner une liste de produits avec une structure valide", async () => {

     AllureUtils.setDescription("Ce test vérifie la récupération de tous les produits avec la méthode Get All.");
     AllureUtils.initSuite("Test Api","Récupérer une liste de produits","Get All");
     AllureUtils.addTags("Api", "sanity","Get All");
     AllureUtils.setSeverity("critical");
     AllureUtils.addLink("URL Get All "," https://automationexercise.com/api/productsList ", "link");
  //  Étape 1 : Création d’un contexte d’appel API isolé
  const context = await test.step("1. Créer le contexte de requête API", async () => {
    return await request.newContext();
  });

  //  Étape 2 : Instancier la classe de gestion de l'API produit
  const api = await test.step("2. Instancier ProductsAPI", async () => {
    return new ProductsAPIPage(context);
  });

  //  Étape 3 : Envoyer la requête pour récupérer les produits
  const products = await test.step("3. Appeler GET /productsList", async () => {
    const result = await api.getAllProducts();
    return result;
  });

  //  Étape 4 : Vérifier que la réponse est correcte
  await test.step("4. Valider la structure de la réponse", async () => {
    // ➤ La réponse est bien un tableau
    expect(Array.isArray(products)).toBeTruthy();

    // ➤ Le tableau contient au moins un produit
    expect(products.length).toBeGreaterThan(0);

    // ➤ Chaque produit doit contenir toutes les clés attendues
    for (const product of products) {
      for (const key of expectedProductKeys) {
        expect(product).toHaveProperty(key); // Ex: id, name, price, brand, category...
      }

      // ➤ Vérification des propriétés imbriquées : category → category et usertype
      expect(product.category).toHaveProperty('category');
      expect(product.category.usertype).toHaveProperty('usertype');
    }
    
    // 🖨️ Étape 5 : Log d'information
    await test.step("🖨️ Loger le nombre de produits retournés", async () => {
      AllureUtils.attachJson(" 🧾 Liste des produits : ",products)
      console.log("📊  Liste total des produits retournés : ", products);     
    });
  });
});
