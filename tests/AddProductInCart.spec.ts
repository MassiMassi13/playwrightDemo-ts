import { test } from "../fixtures/purshaseFixture";
import { AllureUtils } from "../src/utils/allure.utils";
import { DataFactory } from "../src/utils/DataFactory";


test("Ajouter un ou des produits au panier",
  {
    tag: ["@sanity","@smoke"],
    annotation: [
      {
        type: "Jira Story",
        description: "https://www.Jiratest.com/createAcount",
      },
    ],
  },
  async ({ page,user, loginAutoexePage,homeAutoexePage,productsAutoexePage,cartAutoexePage }) => {
    AllureUtils.initSuite("AutomationExe Project", "AutomationExe", "Ajouter un produit dans le panier" );

    AllureUtils.setDescription("Ce test vérifie le bon déroulement d'un ajout de produit dans le panier." );
    AllureUtils.addTags("AddProduct", "sanity");
    AllureUtils.setSeverity("critical");

    await loginAutoexePage.goto();

    await test.step("Saisir le nom et l'adresse email puis clické sur signup", async () => {
        await loginAutoexePage.acceptCockies();
        await loginAutoexePage.login(user.email, user.password);
    });
    
    await test.step("Cliquez sur le bouton « Produits » puis passez la souris sur le premier produit et cliquez sur « Ajouter au panier » ", async () => {
        await homeAutoexePage.clickOnProductsLink()  
        await productsAutoexePage.clickOnPremierProduct();
    });

    await test.step("Cliquez sur le bouton « Continuer les achats » ", async () => {
        await productsAutoexePage.clickOnContinueShopping();
      
    });

    await test.step("Passez la souris sur le deuxième produit et cliquez sur « Ajouter au panier » ", async () => {
        await productsAutoexePage.clickOnSecondProduct();
 
    });

    await test.step("Cliquez sur le bouton « Afficher le panier » ", async () => {
        await productsAutoexePage.goToViewCart();
      
    });

    await test.step("Vérifiez que les deux produits sont ajoutés au panier ", async () => {
        await productsAutoexePage.verifyCar2();
        await AllureUtils.attachJson("Les deux produits sont ajoutés au panier : ", productsAutoexePage.verifyCar2());
        await productsAutoexePage.verifyCartWithNumberOfProduct();
      
    });
    
    await test.step("Vérifiez leurs prix, la quantité et le prix total ", async () => {
        await cartAutoexePage.getQuantutyProduct();
        await page.pause();
        await cartAutoexePage.VerifyPriceProduct();
        await cartAutoexePage.deletProduct();
        await cartAutoexePage.expectMessageCartEmpty();
        await AllureUtils.attachScreenshot("Le Panier est vide , Message  Cart is empty! Click here to buy products.  est visible", page);           
    });

  }
);
