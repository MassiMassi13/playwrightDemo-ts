import { parentSuite, suite, subSuite  ,step, attachment, link, description, epic, feature, story, tags, severity, owner, label, parameter} from "allure-js-commons";
import { Page } from "@playwright/test";

export class AllureUtils {
  /**
   * Initialise une suite Allure structurée : parent, suite, sous-suite
   */
  static initSuite(parent: string, suiteName: string, subSuiteName?: string) {
    parentSuite(parent);
    suite(suiteName);
    if (subSuiteName) {
      subSuite(subSuiteName);
    }
  }

  /**
   * Ajoute une description lisible pour le test
   */
  static setDescription(text: string) {
    description(text);
  }

  /**
   * Ajoute une sévérité : blocker, critical, normal, minor, trivial
   */
  static setSeverity(
    level: "blocker" | "critical" | "normal" | "minor" | "trivial"
  ) {
    severity(level);
  }

  /**
   * Définit le propriétaire du test
   */
  static setOwner(name: string) {
    owner(name);
  }

  /**
   * Ajoute un ou plusieurs tags personnalisés
   */
  static addTags(...tagList: string[]) {
    tags(...tagList);
  }

  /**
   * Ajoute une pièce jointe JSON avec formatage lisible
   */
  static attachJson(name: string, data: unknown) {
    const content = JSON.stringify(data, null, 2);
    attachment(name, content, { contentType: "application/json" });
  }

  /**
   * Ajoute une capture d'écran (png)
   */
  static async attachScreenshot(name: string, page: Page) {
    const screenshotBuffer = await page.screenshot();
    attachment(name, screenshotBuffer, { contentType: "image/png" });
  }

  /**
   * Ajoute une capture d’écran uniquement en cas d’erreur
   */
  static async attachScreenshotOnFailure(
    name: string,
    page: Page,
    condition: boolean
  ) {
    if (condition) {
      await this.attachScreenshot(name, page);
    }
  }

  /**
   * Ajoute une pièce jointe textuelle
   */
  static attachText(name: string, textContent: string) {
    attachment(name, textContent, { contentType: "text/plain" });
  }

  /**
   * Ajoute une pièce jointe HTML (utile pour debug DOM par ex.)
   */
  static attachHtml(name: string, htmlContent: string) {
    attachment(name, htmlContent, { contentType: "text/html" });
  }

  /**
   * Ajoute un lien externe (ex: lien Jira, documentation, ticket)
   */
  static addLink(
    name: string,
    url: string,
    type: "issue" | "tms" | "link" = "link"
  ) {
    link(url, name, type);
  }

  /**
   * Ajoute un label personnalisé
   */
  static addLabel(name: string, value: string) {
    label(name, value);
  }

  /**
   * Ajoute un paramètre au test
   */
  static addParameter(name: string, value: string) {
    parameter(name, value);
  }

  /**
   * Définit l'épopée (epic) du test
   */
  static setEpic(epicName: string) {
    epic(epicName);
  }

  /**
   * Définit la fonctionnalité (feature) du test
   */
  static setFeature(featureName: string) {
    feature(featureName);
  }

  /**
   * Définit l'histoire (story) du test
   */
  static setStory(storyName: string) {
    story(storyName);
  }
}
