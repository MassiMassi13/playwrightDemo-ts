import { test } from "../fixtures/user-fixture";
import { AllureUtils } from "../src/utils/allure.utils";

test(
  "✔ Connexion d’un utilisateur existant avec des identifiants valides",
  {
    tag: ["@login", "@sanity"],
    annotation: [
      { type: "Jira Story", description: "https://jira.com/AutomationExe" },
    ],
  },
  async ({ page, user, loginAutoexePage }) => {
    AllureUtils.initSuite(
      "AutomationExe Project",
      "AutomationExe",
      "Authentification"
    );
    AllureUtils.setDescription(
      "Ce test vérifie l'authentification avec des identifiants valides."
    );
    AllureUtils.addTags("login", "sanity");
    AllureUtils.setSeverity("critical");

    await loginAutoexePage.goto();

    await test.step("1. Saisir l'email et le mot de passe", async () => {
      //await loginAutoexePage.acceptCockies();
      await loginAutoexePage.login(user.email, user.password);
      AllureUtils.attachJson("Email utilisateur", user.email);
      AllureUtils.attachJson("Password utilisateur", user.password);
    });

    await test.step("2. Vérifier la connexion réussie", async () => {
      await loginAutoexePage.expectLoginSuccess();
      await AllureUtils.attachScreenshot("Dashboard après connexion", page);
    });
  }
);

test(
  "❌ Connexion échouée avec un mot de passe invalide",
  {
    tag: ["@login", "@sanity"],
    annotation: [
      { type: "Jira Story", description: "https://jira.com/AutomationExe" },
    ],
  },
  async ({ page, user, loginAutoexePage }) => {
    AllureUtils.initSuite(
      "AutomationExe Project",
      "AutomationExe",
      "Authentification"
    );
    AllureUtils.setDescription(
      "Ce test vérifie que la connexion échoue avec un mauvais mot de passe."
    );
    AllureUtils.addTags("login", "sanity");
    AllureUtils.setSeverity("critical");

    await loginAutoexePage.goto();

    await test.step("1. Saisir l'email et un mauvais mot de passe", async () => {
      //await loginAutoexePage.acceptCockies();
      await loginAutoexePage.login(user.email, "wrong-password");
      AllureUtils.attachJson("Email utilisateur", user.email);
      AllureUtils.attachJson("Password utilisé", "wrong-password");
    });

    await test.step("2. Vérifier le message d'erreur", async () => {
      await loginAutoexePage.expectLoginFail();
      await AllureUtils.attachScreenshot("Message d'erreur affiché", page);
    });
  }
);
