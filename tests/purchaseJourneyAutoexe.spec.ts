import { test } from "../fixtures/user-fixture";
import { HomeAutoexePage } from "../src/page-objects/automationExe/e2e/HomeAutoexePage";
import { ProductsAutoexePage } from "../src/page-objects/automationExe/e2e/ProductsAutoexePage";
import { AllureUtils } from "../src/utils/allure.utils";


test( "✔ Connexion d’un utilisateur existant avec des identifiants valides", {tag: ["@login", "@sanity"],
    annotation: [{ type: "Jira Story", description: "https://jira.com/AutomationExe" } ] },
  async ({ page, user, loginAutoexePage }) => {
    AllureUtils.initSuite("AutomationExe Project", "AutomationExe","Parcours d'achat" );
    AllureUtils.setDescription("Ce test vérifie le bon déroulement d'un parcous d'achat complet." );
    AllureUtils.addTags("purchase", "sanity");
    AllureUtils.setSeverity("critical");
    const homeAutoexePage = new HomeAutoexePage(page);
    const productsAutoexePage = new ProductsAutoexePage(page);

    
    await loginAutoexePage.goto();
    
    await test.step("1. Connexion et vérification de la bonne authentification", async () => {
      await loginAutoexePage.acceptCockies();
      await loginAutoexePage.login(user.email, user.password);
      AllureUtils.attachJson("Email utilisateur", user.email);
      AllureUtils.attachJson("Password utilisateur", user.password);
      await loginAutoexePage.expectLoginSuccess();
      await AllureUtils.attachScreenshot("Dashboard après connexion", page);
    });
    
    await test.step("2. Navigation vers la section Produits ", async () => {
        await homeAutoexePage.clickOnProductsLink();
        
      });
      await test.step("3. Chercher un produit dans la bar de recherche ", async () => {
        await productsAutoexePage.fillFieldSearchProduct();
        await productsAutoexePage.ClickButonSearch();
        
        
      });
      await test.step("4. Ajouter un produit au panier ", async () => {
        await productsAutoexePage.clickOnFirstProduct();
        await productsAutoexePage.ExpectMessageProductAdded();
        
      });
      await test.step("5. Accéder au panier et Vérifier le panier ", async () => {
        await page.pause();
        await productsAutoexePage.goToViewCart();
        await productsAutoexePage.verifyCart();

  });
  await test.step("6. Passage à la caisse ", async () => {
      

  });


});




// - Passage à la caisse
// - Remplissage des informations de livraison
// - Choix d’une méthode de paiement fictive
// - Validation et confirmation de commande
// - Vérification du message de succès