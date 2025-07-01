import { test } from "../fixtures/purshaseFixture";
import { AllureUtils } from "../src/utils/allure.utils";


test( "✔ Connexion d’un utilisateur existant avec des identifiants valides", {tag: ["@smoke", "@sanity"],
    annotation: [{ type: "Jira Story", description: "https://jira.com/AutomationExe" } ] },
  async ({ page, user, loginAutoexePage, homeAutoexePage, productsAutoexePage, cartAutoexePage, paymentAutoexePage }) => {
    AllureUtils.initSuite("AutomationExe Project", "AutomationExe","Parcours d'achat" );
    AllureUtils.setDescription("Ce test vérifie le bon déroulement d'un parcous d'achat complet." );
    AllureUtils.addTags("purchase", "sanity");
    AllureUtils.setSeverity("critical");
        
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
        AllureUtils.attachJson("Produit recherché : ", productsAutoexePage.selectedCategory);
        await productsAutoexePage.ClickButonSearch();
        
        
    });
    
    await test.step("4. Ajouter un produit au panier ", async () => {
        await productsAutoexePage.clickOnFirstProduct();
        await productsAutoexePage.ExpectMessageProductAdded();
        
    });
    
    await test.step("5. Accéder au panier et Vérifier le panier ", async () => {
      await productsAutoexePage.goToViewCart();
      await productsAutoexePage.verifyCart();

    });

    await test.step("6. Passage à la caisse ", async () => {

      await cartAutoexePage.clickProceedToCheckout();

    });

    await test.step("7. Remplissage des informations de livraison", async () => {
    
      await cartAutoexePage.fillTextArea();
      await cartAutoexePage.clickPlaceOrder();
    });
    
    await test.step("8. Choix d’une méthode de paiement fictive et confirmation de la commande ", async () => {
      await page.pause();
      await paymentAutoexePage.fillCardInformation();
      await AllureUtils.attachScreenshot("✅ Page de paiement OK", page);
 
    });


    await test.step("9. Vérification du message de succès", async () => {
    
      await paymentAutoexePage.ExpectOrderPlaced();
 
    });


});





// - Validation et confirmation de commande
