import {Page,Locator, expect } from "@playwright/test"

export class CartAutoexePage {
    private proceedToCheckout : Locator;
    private textArea : Locator;
    private placeOrder : Locator;


    constructor(private page: Page) {
        this.proceedToCheckout = page.getByText('Proceed To Checkout');
        this.textArea = page.locator('textarea[name="message"]');
        this.placeOrder = page.getByRole('link', { name: 'Place Order' });
        
    }

    async clickProceedToCheckout(){

        await this.proceedToCheckout.click();

    }

    async fillTextArea(){

        await this.textArea.fill("je souhaite recevoir ma commande dans les plus bref délait Merci :) ");

    }
    async clickPlaceOrder(){
        await this.placeOrder.click();
    }


}