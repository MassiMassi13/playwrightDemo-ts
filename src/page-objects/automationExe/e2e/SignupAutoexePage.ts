import { Locator, expect, Page } from "@playwright/test";
import { getRandomElement } from "../../../utils/randomUtils";
import { DataFactory } from "../../../utils/DataFactory";
import { promiseHooks } from "v8";

export class SignupAutoexePage {
  private gender1: Locator;
  private gender2: Locator;
  private password: Locator;
  private day: Locator;
  private month: Locator;
  private year: Locator;
  private firstName: Locator;
  private lastName: Locator;
  private company: Locator;
  private adress: Locator;
  private country: Locator;
  private country1: Locator;
  private state: Locator;
  private city: Locator;
  private zipCode: Locator;
  private mobileNumber: Locator;
  private createAccountButton: Locator;
  private accountCreatedMessage: Locator;
  private successfullyMessage: Locator;

  constructor(private page: Page) {
    this.gender1 = page.locator("#id_gender1");
    this.gender2 = page.locator("#id_gender2");
    this.password = page.locator('input[data-qa="password"]');
    this.day = page.locator('select[data-qa="days"]');
    this.month = page.locator('select[data-qa="months"]');
    this.year = page.locator('select[data-qa="years"]');
    this.firstName = page.locator('input[data-qa="first_name"]');
    this.lastName = page.locator('input[data-qa="last_name"]');
    this.company = page.locator('input[data-qa="last_name"]');
    this.adress = page.locator('input[data-qa="address"]');
    this.country = page.locator('select[data-qa="country"]');
    this.country1 = page.getByLabel("Country *");
    this.state = page.locator('input[data-qa="state"]');
    this.city = page.locator('input[data-qa="city"]');
    this.zipCode = page.locator('input[data-qa="zipcode"]');
    this.mobileNumber = page.locator('input[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
    this.accountCreatedMessage = page.getByRole('heading', { name: 'Account Created!' });
    this.successfullyMessage = page.getByText('Account Created! Congratulations! Your new account has been successfully');
  }
  async checkRandomGender() {
    const genderOptions = [this.gender1, this.gender2];
    const randomGender = getRandomElement(genderOptions);
    await randomGender.check();
  }

  async fillPassword() {
    await this.password.fill("test1234");
  }

  async fillDateOfBirth() {
    const month = await this.getRandomMonthText();
    console.log("📅 Le mois choisit est bien le : ", month);

    await this.day.pressSequentially("13");
    await this.month.click();
    await this.month.pressSequentially(month);
    await this.year.pressSequentially("1989");
  }

  async getRandomMonthText(): Promise<string> {
    const monthOptions = await this.month.locator("option").all();
    const validOptions = monthOptions.slice(1); // ignore "Month"

    const randomOption = getRandomElement(validOptions);
    const monthText = await randomOption.textContent();
    return monthText!.trim(); // ex: "March"
  }

  async fillFirstnameAndLastName() {
    await this.firstName.fill(DataFactory.getDirectorFirstName());
    await this.lastName.fill(DataFactory.getDirectorLastName());
  }

  async fillCompanyAdressStateCityZipcodeMobilenumber() {
    await this.company.fill(DataFactory.getCompanyName());
    await this.adress.fill(DataFactory.getAddress());
    await this.state.fill(DataFactory.getStateFrance());
    await this.city.fill(DataFactory.getCity());
    await this.zipCode.fill(DataFactory.getZipCode());
    await this.mobileNumber.fill(DataFactory.getPhoneNumber());
  }
  async selectRandomCountry() {
    //  Récupère tous les éléments <option> du <select> pays
    const options = await this.country.locator("option").all();
    console.log("valeur récupérer : ", options);

    // Initialiser une liste
    const validOptions: string[] = [];

    // Parcours chaque <option>
    for (const option of options) {
      //  Récupère l'attribut "value" de l'option (ex : "India")
      const value = await option.getAttribute("value");

      //  Ne garde que les valeurs non nulles et non vides (exclut "Country" ou "")
      if (value && value.trim() !== "") {
        validOptions.push(value);
      }
    }
    console.log("Les valeurs sont les suivantes : ", validOptions);

    //  Sélectionne un pays aléatoire parmi les options valides avec ton utilitaire perso
    const randomCountry = getRandomElement(validOptions);

    //  Log dans la console le pays choisi pour debug ou vérification
    console.log("🌍 Pays sélectionné aléatoirement :", randomCountry);

    //  Utilise Playwright pour sélectionner ce pays dans le <select>
    await this.country.selectOption(randomCountry);
 }

 async clickCreateAccountButton(){
    await this.createAccountButton.click()

 }
 async expectMessageSuccessfully(){
    const elements = [this.successfullyMessage,this.accountCreatedMessage];
    await Promise.all(elements.map((element) => expect(element).toBeVisible()));

 }
}
