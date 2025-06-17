import { CardInfo } from "./CardInfo";
import { DataFactory } from "../../utils/DataFactory";

export class CardInfoBuilder {
  private nameOnCard: string = DataFactory.getNameOnCard();
  private cardNumber: string = DataFactory.getValidCardNumber();
  private cvc: string = DataFactory.getCvc();
  private expirationMonth: string = DataFactory.getExpirationMonth();
  private expirationYear: string = DataFactory.getExpirationYear();

  static create(): CardInfoBuilder {
    return new CardInfoBuilder();
  }

  withName(name: string): CardInfoBuilder {
    this.nameOnCard = name;
    return this;
  }

  withCardNumber(number: string): CardInfoBuilder {
    this.cardNumber = number;
    return this;
  }

  withCvc(cvc: string): CardInfoBuilder {
    this.cvc = cvc;
    return this;
  }

  withExpiration(month: string, year: string): CardInfoBuilder {
    this.expirationMonth = month;
    this.expirationYear = year;
    return this;
  }

  build(): CardInfo {
    return new CardInfo(
      this.nameOnCard,
      this.cardNumber,
      this.cvc,
      this.expirationMonth,
      this.expirationYear
    );
  }
}
