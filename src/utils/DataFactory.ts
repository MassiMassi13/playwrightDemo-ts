import { faker } from "@faker-js/faker";
import moment from "moment";

export class DataFactory {
  static getRandomGender(): "Male" | "Female" {
    const genders: ("Male" | "Female")[] = ["Male", "Female"];
    const randomIndex = Math.floor(Math.random() * genders.length);
    return genders[randomIndex];
  }
  static getFirstName(gender: "Male" | "Female"): string {
    switch (gender) {
      case "Male":
        return faker.person.firstName("male");
      case "Female":
        return faker.person.firstName("female");
    }
  }

  static getFirstNamee(gender: "Male" | "Female"): string {
    return faker.person.firstName(gender === "Male" ? "male" : "female");
  }

  static getFirstName1(): string {
    const genders: ("Male" | "Female")[] = ["Male", "Female"];

    const randomIndex = Math.floor(Math.random() * genders.length);
    const randomGender = genders[randomIndex];

    return faker.person.firstName(
      randomGender.toLowerCase() as "female" | "male"
    );
  }

  static getLastName(): string {
    return faker.person.lastName();
  }

  static getGender(): "Male" | "Female" | "Other" {
    return faker.helpers.arrayElement(["Male", "Female", "Other"]);
  }

  static getEmail(): string {
    return faker.internet.email().toLowerCase();
  }
  static getPassword(): string {
    return faker.internet.password({ length: 12, memorable: true });
  }

  static getBirthDate(): string {
    const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: "age" });
    return birthDate.toLocaleDateString("fr-FR");
  }

  static getNationalId(): string {
    return faker.string.numeric(13);
  }

  static getPassportNumber(): string {
    return faker.string.alphanumeric(9).toUpperCase();
  }

  static getMembershipNumber(): string {
    return faker.string.numeric(8);
  }

  static getSubscriptionDate(): string {
    return this.getFormattedDate("DD/MM/YYYY");
  }

  // Adhérent moral
  static getCompanyName(): string {
    return faker.company.name();
  }

  static getLegalStatus(): string {
    return faker.helpers.arrayElement([
      "EI : Entreprise individuelle",
      "EIRL : Entreprise individuelle à responsabilité limitée",
      "GIE : Groupement d’intérêt économique",
      "SAS : Société par actions simplifiée",
    ]);
  }

  static getRegistrationNumber(): string {
    return faker.string.numeric(8);
  }

  static getTaxId(): string {
    return faker.string.numeric(11);
  }

  static getWebsite(): string {
    return faker.internet.url();
  }

  static getAddress(): string {
    return faker.location.streetAddress();
  }

  static getCity(): string {
    return faker.location.city();
  }

  static getZipCode(): string {
    return faker.location.zipCode("#####");
  }

  static getCountry(): string {
    return faker.location.country();
  }

  static getPhoneNumber(): string {
    return faker.phone.number();
  }

  static getDirectorFirstName(): string {
    return faker.person.firstName();
  }

  static getDirectorLastName(): string {
    return faker.person.lastName();
  }

  static getDirectorEmail(): string {
    return faker.internet.email();
  }

  static getRib(): string {
    return faker.finance.iban();
  }

  static getInsuranceNumber(): string {
    return faker.string.numeric(15);
  }

  static getFoundationDate(): string {
    const randomFoundationOffset = faker.number.int({ min: 3650, max: 20000 });
    return this.getFormattedDate("DD/MM/YYYY", -randomFoundationOffset);
  }

  static getEmployeeCount(): number {
    return faker.number.int({ min: 1, max: 500 });
  }

  static getAnnualRevenue(): number {
    return faker.number.int({ min: 100000, max: 100000000 });
  }

  static getProfessionalId(): string {
    return faker.string.uuid();
  }

  static getLicenseNumber(): string {
    return faker.string.alphanumeric(10).toUpperCase();
  }

  static getSpecialty(): string {
    return faker.helpers.arrayElement([
      "Médecin",
      "Infirmier",
      "Pharmacien",
      "Dentiste",
      "Kinésithérapeute",
      "Chirurgien",
      "Orthophoniste",
      "Psychologue",
    ]);
  }

  static getHospitalAffiliation(): string {
    return faker.company.name();
  }

  static getYearsOfExperience(): number {
    return faker.number.int({ min: 1, max: 40 });
  }

  static getRegistrationDate(): string {
    return this.getFormattedDate("DD/MM/YYYY");
  }

  // Méthodes utilitaires
  private static getFormattedDate(
    format: string = "YYYY-MM-DD",
    daysOffset: number = 0
  ): string {
    return moment().add(daysOffset, "days").format(format);
  }

  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: true }),
      date: "10101986",
    };
  }
}
