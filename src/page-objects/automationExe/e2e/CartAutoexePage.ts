import {Page,Locator, expect } from "@playwright/test"

export class CartAutoexePage {
    private proceedToCheckout : Locator;
    private textArea : Locator;
    private placeOrder : Locator;
    private quantityProduct1 :Locator;
    private quantityProduct2 :Locator;
    private priceProduct1 :Locator;
    private priceProduct2 :Locator;
    private deleteProduct1 :Locator;
    private deletProduct2 :Locator;
    private MessageCartEmpty : Locator;


    constructor(private page: Page) {
        this.proceedToCheckout = page.getByText('Proceed To Checkout');
        this.textArea = page.locator('textarea[name="message"]');
        this.placeOrder = page.getByRole('link', { name: 'Place Order' });
        this.quantityProduct1 = page.locator('tbody >tr > td.cart_quantity > button').first();
        this.quantityProduct2 = page.locator('tbody >tr > td.cart_quantity > button').nth(1);
        this.priceProduct1 = page.locator('p.cart_total_price').first();
        this.priceProduct2 = page.locator('p.cart_total_price').nth(1);
        this.deleteProduct1 = page.locator('a.cart_quantity_delete').first();
        this.deletProduct2 = page.locator('a.cart_quantity_delete').nth(1);
        this.MessageCartEmpty = page.getByText('Cart is empty! Click here to buy products');
        
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

    async getQuantutyProduct(){
        const quantity1 = await this.quantityProduct1.textContent();
        console.log("la quantité du premier produit est de : ", quantity1);
        const quantity2 = await this.quantityProduct2.textContent();
        console.log("la quantité du second produit est de : ", quantity2);
        await expect(quantity1).toBeDefined();
        await expect(quantity2).toBeDefined();

    }

    async VerifyPriceProduct() {
        const price1 = await this.priceProduct1.textContent();    
        console.log("le prix du premier produit est de : ", price1);        
        await expect(this.priceProduct1).toHaveText("Rs. 500");
    
        const price2 = await this.priceProduct2.textContent();
        console.log("le prix du second produit est de : ", price2);
        await expect(this.priceProduct2).toHaveText("Rs. 400");
    }

    async deletProduct(){
        await this.deleteProduct1.click();
        await this.deletProduct2.click();
    }
    async expectMessageCartEmpty(){
        await expect(this.MessageCartEmpty).toBeVisible();
    }


}