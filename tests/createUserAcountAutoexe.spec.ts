import { test } from "../fixtures/CreateAcountFixture";
import { AllureUtils } from "../src/utils/allure.utils";
import { DataFactory } from "../src/utils/DataFactory";

test(
  "Acceder à la page de connexion / inscription",
  {
    tag: ["@sanity"],
    annotation: [
      {
        type: "Jira Story",
        description: "https://www.Jiratest.com/createAcount",
      },
    ],
},
  async ({ page, loginAutoexePage, signupAutoexePage }) => {
    AllureUtils.initSuite(
      "AutomationExe Project",
      "AutomationExe",
      "Création d’un compte utilisateur"
    );
    AllureUtils.setDescription(
      "Ce test vérifie le bon déroulement d'une création de compte utilisateur."
    );
    AllureUtils.addTags("CreateUserAcount", "sanity");
    AllureUtils.setSeverity("critical");

    await loginAutoexePage.goto();

    await test.step("Saisir le nom et l'adresse email puis clické sur signup", async () => {

      await page.getByRole('button', { name: 'Consent' }).click();
      const name = DataFactory.getLastName();
      const email = DataFactory.getDirectorEmail();
      AllureUtils.attachJson("Name : ", name);
      AllureUtils.attachJson("Email : ", email);

      await loginAutoexePage.signup(name, email);
    });

    await test.step("saisir le formulaire d'incription", async () => {
      await signupAutoexePage.checkRandomGender();
      await signupAutoexePage.fillPassword();
      await signupAutoexePage.fillDateOfBirth();
      await signupAutoexePage.fillFirstnameAndLastName();
      await signupAutoexePage.fillCompanyAdressStateCityZipcodeMobilenumber();
      await signupAutoexePage.selectRandomCountry();
      await page.pause();
      await signupAutoexePage.clickCreateAccountButton();
      await signupAutoexePage.expectMessageSuccessfully();
      await page.pause();

    });
  }
);
