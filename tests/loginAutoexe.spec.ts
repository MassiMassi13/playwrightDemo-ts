import { test } from '../fixtures/user-fixture';
import { AllureUtils } from '../src/utils/allure.utils';
      

test.describe('🔐 Connexion d’un utilisateur existant ', () => {
  test(' Connexion d’un utilisateur existant avec des identifiants valide',{tag: ['@login', '@sanity'], annotation: [
    { type: 'Jira Story', 
      description: 'https://jira.com/AutomationExe' },
  ]}, async ({ page, user,loginAutoexePage }) => {

    AllureUtils.initSuite('AutomationExe Project', 'AutomationExe', 'Authentification');
    AllureUtils.setDescription('Ce testil a pour but de vérifier l\'authentification avec des identifiants valides.');
    AllureUtils.addTags('login', 'sanity');
    AllureUtils.setSeverity('critical');
   
    await loginAutoexePage.goto();
    await loginAutoexePage.acceptCockies();
    await loginAutoexePage.login(user.email, user.password);
    await loginAutoexePage.expectLoginSuccess();
});

test(' Connexion d’un utilisateur existant mais avec un mot de passe erroné',{tag: ['@login', '@sanity'], annotation: [
    { type: 'Jira Story', 
      description: 'https://jira.com/AutomationExe' },
  ]}, async ({ page, user,loginAutoexePage }) => {

    AllureUtils.initSuite('AutomationExe Project', 'AutomationExe', 'Authentification');
    AllureUtils.setDescription('Ce testil a pour but de vérifier l\'authentification avec des identifiants invalide.');
    AllureUtils.addTags('login', 'sanity');
    AllureUtils.setSeverity('critical');
    
    await loginAutoexePage.goto();
    await loginAutoexePage.acceptCockies();
    await page.pause();
    await loginAutoexePage.login(user.email, 'wrong-password');
    await loginAutoexePage.expectLoginFail();
  });
});