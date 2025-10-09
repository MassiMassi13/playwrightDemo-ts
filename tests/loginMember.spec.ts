import { test, expect } from "@playwright/test";
import LoginPage from "../src/page-objects/loginPage/LoginPage";
import userQa from "../src/test-data/qa/userQa";
import { AllureUtils } from "../src/utils/allure.utils";
import { allure } from "allure-playwright";
import { DataFactoryPhysicalMember } from "../src/utils/DataFactoryPhysicalMemberFirst";
import { DataFactory } from "../src/utils/DataFactory";

test("Connexion utilisateur valide", { tag: ["@login", "@favorite"] , 
  annotation:[{
    type:"Jira Story",
     description:"https://www.atlassian.net/jira/software/projects/scrum/boards/1/backlog?selectedIssue=SCRUM-1"},
      {
        type: "Test Case",
        description: "TC-001: Vérifier la connexion avec identifiants valides"
      }
  ]} , async ({ page }) => {
  AllureUtils.initSuite("Automation Project", "OrangeHrm", "Authentification");
  AllureUtils.setDescription("Ce test vérifie la connexion avec des identifiants valides.");
  AllureUtils.setSeverity("critical");
  AllureUtils.addTags("login", "smoke");
  // A revoir plus tard
  // await allure.parentSuite("Automation Project");
  // await allure.suite("OrangeHrm");
  // await allure.subSuite("Authentification");
  const loginPage = new LoginPage(page);

  await page.goto("/");

  await test.step("1. Saisir le nom d'utilisateur", async () => {
    //await loginPage.fillUsername();
    //await loginPage.fillField('username', userQa.user_auth.login)
    await loginPage.fillUsername(userQa.user_auth.login);
    //await page.pause();
    // await allure.attachment("User data",JSON.stringify("TEST-TEST", null, 2),"application/json");
    AllureUtils.attachJson("Données utilisateur", userQa.user_auth.login);
    //await allure.attachment("User data", JSON.stringify(userQa.user_auth.login, null, 2),"application/json" );

    await allure.attachment("User Data First Name", JSON.stringify(DataFactoryPhysicalMember.getFirstName("Male"), null, 2),
      "application/json"
    );
    await allure.attachment("First name random",JSON.stringify(DataFactory.getFirstName1(), null, 2),"application/json");

   //await page.pause();
  });
  await test.step("2. Saisir le mot de passe", async () => {
    await loginPage.fillPassword();
    AllureUtils.attachJson("Mot de passe", userQa.user_auth.password);
    //await allure.attachment("User Data",JSON.stringify(userQa.user_auth.password, null, 2),"application/json");
  });
  await test.step("3. Cliquer sur Connexion", async () => {
    //await page.pause();
    await loginPage.clickLoginButton();
  });

  await test.step("4. Vérifier que le dashboard est affiché", async () => {
    
    await expect(page).toHaveTitle(/OrangeHRM/);
    await page.waitForTimeout(5000 ); 
    await page.screenshot({ path: 'screenshot-dashboard.png' });
    await AllureUtils.attachScreenshot("Dashboard", page);
    await allure.attachment("Dashboard", await page.screenshot(), "image/png");
  }); 
  //await page.pause();
});

test("The member logining ",{ tag: ["@logining", "@favorite"] },async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto("/");
    await loginPage.loginToApplication();
    await expect(page).toHaveTitle(/OrangeHRM/);
  }
);
