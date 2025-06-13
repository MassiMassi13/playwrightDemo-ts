import { Page, Locator, expect } from "@playwright/test";
import { DataFactory } from "../../../../src/utils/DataFactory";

export class PaymentAutoexePage {
  private nameOnCard: Locator;
  private cardNumber: Locator;
  private cvc: Locator;
  private experationMonth: Locator;
  private experationYear: Locator;
  private confirmOrderButton: Locator;
  private orderPlacedMessage: Locator;
  private continueButton: Locator;
  private congratulationsMessage: Locator;

  constructor(private page: Page) {
    this.nameOnCard = page.locator('input[name="name_on_card"]');
    this.cardNumber = page.locator('input[name="card_number"]');
    this.cvc = page.getByRole("textbox", { name: "ex." });
    this.experationMonth = page.getByRole("textbox", { name: "MM" });
    this.experationYear = page.getByRole("textbox", { name: "YYYY" });
    this.confirmOrderButton = page.getByRole("button", {name: "Pay and Confirm Order"});
    this.orderPlacedMessage = page.getByText("Order Placed!");
    this.continueButton = page.getByRole("link", { name: "Continue" });
    this.congratulationsMessage = page.getByText('Congratulations! Your order')
  }

  async fillCardInformation() {
    await this.nameOnCard.fill(DataFactory.getDirectorFirstName());
    await this.cardNumber.fill("1234567");
    await this.cvc.fill("123");
    await this.experationMonth.fill("11");
    await this.experationYear.fill("2026");
    await this.confirmOrderButton.click();
  }

  async ExpectOrderPlaced(timeout: number = 10000) {
    const elements = [this.orderPlacedMessage, this.continueButton];
    await Promise.all(elements.map((element) => expect(element).toBeVisible({ timeout })));

    await expect.soft(this.congratulationsMessage).toBeVisible(); // "soft" Si ça échoue, continue quand même
  }
}
