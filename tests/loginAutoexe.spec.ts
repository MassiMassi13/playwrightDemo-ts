import { test } from '../fixtures/user-fixture';
import { AllureUtils } from '../src/utils/allure.utils';
      

test('🔐 Connexion d’un utilisateur existant ', () => {
  test(' ✔ Connexion d’un utilisateur existant avec des identifiants valide',{tag: ['@login', '@sanity'], annotation: [
    { type: 'Jira Story', 
      description: 'https://jira.com/AutomationExe' },
  ]}, async ({ page, user,loginAutoexePage }) => {

    AllureUtils.initSuite('AutomationExe Project', 'AutomationExe', 'Authentification');
    AllureUtils.setDescription('Ce test a pour but de vérifier l\'authentification avec des identifiants valides.');
    AllureUtils.addTags('login', 'sanity');
    AllureUtils.setSeverity('critical');
   
    await loginAutoexePage.goto();
    
    await test.step("1. Saisir le nom ed'utilisateur et le mot de passe", async () => {
    await loginAutoexePage.acceptCockies();
    await loginAutoexePage.login(user.email, user.password);
    AllureUtils.attachJson('Email utilisateur', user.email);
    AllureUtils.attachJson('Password utilisateur', user.password);
    });

    await test.step("2. Vérifier si l'utilisateur c'est bien authentifier", async () => {
    await loginAutoexePage.expectLoginSuccess();
    await AllureUtils.attachScreenshot('Dashboard', page);
    });
});

test(' ❌ Connexion d’un utilisateur existant mais avec un mot de passe erroné',{tag: ['@login', '@sanity'], annotation: [
    { type: 'Jira Story', 
      description: 'https://jira.com/AutomationExe' },
  ]}, async ({ page, user,loginAutoexePage }) => {

    AllureUtils.initSuite('AutomationExe Project', 'AutomationExe', 'Authentification');
    AllureUtils.setDescription('Ce test a pour but de vérifier l\'authentification avec des identifiants invalide.');
    AllureUtils.addTags('login', 'sanity');
    AllureUtils.setSeverity('critical');
    
    await loginAutoexePage.goto();
    await test.step("1. Saisir le nom ed'utilisateur et le mot de passe", async () => {
    await loginAutoexePage.acceptCockies();
    await loginAutoexePage.login(user.email, 'wrong-password');
    AllureUtils.attachJson('Email utilisateur', user.email);
    AllureUtils.attachJson('Password utilisateur', user.password);
    });

    await test.step("2. Vérifier si l'utilisateur a un message d'erreur", async () => {
    await AllureUtils.attachScreenshot('Dashboard', page);
    await loginAutoexePage.expectLoginFail();
    });
  });
});