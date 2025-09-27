import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly yourCartTitle: Locator;
  readonly itemQty: Locator;
  readonly  itemName: Locator;
  readonly checkoutButton: Locator;
  readonly removeButtons: Locator;
  readonly continueShoppingButton: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this. yourCartTitle = page.locator('[data-test="title"]');
    this.itemQty = page.locator('[data-test="item-quantity"]');
    this.itemName = page.locator('[data-test="inventory-item-name"]');   
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeButtons = page.locator('button:has-text("Remove")');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
   
  }


  async completeCheckoutStepsBeforeFinish(checkoutPage: any): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-step-one.html');
    await checkoutPage.fillCheckoutForm('Olena', 'Danchenko', '32000');
    await checkoutPage.clickContinue();
    await this.page.waitForURL('**/checkout-step-two.html');
  }
}