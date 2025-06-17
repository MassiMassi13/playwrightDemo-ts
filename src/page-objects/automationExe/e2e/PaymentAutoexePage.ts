import { Page, Locator, expect } from "@playwright/test";
import { DataFactory } from "../../../../src/utils/DataFactory";
import { CardInfoBuilder } from "../../../test-data/qa/CardInfoBuilder";

export class PaymentAutoexePage {
  private nameOnCard: Locator;
  private cardNumber: Locator;
  private cvc: Locator;
  private expirationMonth: Locator;
  private expirationYear: Locator;
  private confirmOrderButton: Locator;
  private orderPlacedMessage: Locator;
  private continueButton: Locator;
  private congratulationsMessage: Locator;

  constructor(private page: Page) {
    this.nameOnCard = page.locator('input[name="name_on_card"]');
    this.cardNumber = page.locator('input[name="card_number"]');
    this.cvc = page.getByRole("textbox", { name: "ex." });
    this.expirationMonth = page.getByRole("textbox", { name: "MM" });
    this.expirationYear = page.getByRole("textbox", { name: "YYYY" });
    this.confirmOrderButton = page.getByRole("button", {name: "Pay and Confirm Order"});
    this.orderPlacedMessage = page.getByText("Order Placed!");
    this.continueButton = page.getByRole("link", { name: "Continue" });
    this.congratulationsMessage = page.getByText('Congratulations! Your order')
  }

  async fillCardInformation() {

    //
    //const cardInfo1 = CardInfoBuilder.create().withCardNumber("123456").withCvc("123").withExpiration("11", "2026").build();
    const cardInfo = CardInfoBuilder.create().build();
    console.log("Voiçi les informations de card Infos ; " ,cardInfo)
  
    await this.nameOnCard.fill(cardInfo.nameOnCard);
    await this.cardNumber.fill(cardInfo.cardNumber);
    await this.cvc.fill(cardInfo.cvc);
    await this.expirationMonth.fill(cardInfo.expirationMonth);
    await this.expirationYear.fill(cardInfo.expirationYear);
    await this.confirmOrderButton.click();
  }

  async ExpectOrderPlaced(timeout: number = 10000) {
    const elements = [this.orderPlacedMessage, this.continueButton];
    await Promise.all(elements.map((element) => expect(element).toBeVisible({ timeout })));

    await expect.soft(this.congratulationsMessage).toBeVisible(); // "soft" Si ça échoue, continue quand même
  }
}
