import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productContainer: Locator;
  readonly cartIcon: Locator;
  readonly products : Locator;
  readonly sortDropdown: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.productContainer = page.locator('[data-test="login-credentials"]');
    this.products = page.locator('[data-test="inventory-item"]');
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[class ="product_sort_container"]');
  }

  async addOneProductAndGoToCart(cartPage: any): Promise<string> {
    // Add product to cart
    const products = await this.products.all();
    const product = products[0];
    const productName = await product.locator('[data-test="inventory-item-name"]').textContent();
    const addToCartButton = product.getByRole('button', { name: 'Add to cart' });
    await addToCartButton.first().click();
    
    // Navigate to cart
    await this.cartIcon.click();
    await this.page.waitForURL('**/cart.html');
    
    // Verify cart contents
    await expect(cartPage.yourCartTitle).toHaveText('Your Cart');
    await expect(cartPage.itemQty.first()).toHaveText('1');
    await expect(cartPage.itemName.first()).toHaveText(productName || '');
    
    return productName || '';
  }

  async addTwoProductsAndGoToCart(cartPage: any): Promise<{ firstProductName: string; secondProductName: string }> {
    // Add first product (index 0)
    const products = await this.products.all();
    const firstProduct = products[0];
    const firstProductName = await firstProduct.locator('[data-test="inventory-item-name"]').textContent();
    const addToCartButtonFirst = firstProduct.getByRole('button', { name: 'Add to cart' });
    await addToCartButtonFirst.first().click();
    
    // Add second product (index 1)
    const secondProduct = products[1];
    const secondProductName = await secondProduct.locator('[data-test="inventory-item-name"]').textContent();
    const addToCartButtonSecond = secondProduct.getByRole('button', { name: 'Add to cart' });
    await addToCartButtonSecond.first().click();
    
    // Navigate to cart
    await this.cartIcon.click();
    await this.page.waitForURL('**/cart.html');
    
    // Verify cart contents with both products
    await expect(cartPage.yourCartTitle).toHaveText('Your Cart');
    await expect(cartPage.itemQty.first()).toHaveText('1');
    await expect(cartPage.itemName.first()).toHaveText(firstProductName || '');
    await expect(cartPage.itemQty.nth(1)).toHaveText('1');
    await expect(cartPage.itemName.nth(1)).toHaveText(secondProductName || '');
    
    return { firstProductName: firstProductName || '', secondProductName: secondProductName || '' };
  }

  async getFirstTwoProductsInfo(): Promise<{
    firstProductName: string;
    secondProductName: string;
    firstProductPrice: number;
    secondProductPrice: number;
  }> {
    const products = await this.products.all();
    const firstProduct = products[0];
    const secondProduct = products[1];
    
    const firstProductName = await firstProduct.locator('[data-test="inventory-item-name"]').textContent();
    const secondProductName = await secondProduct.locator('[data-test="inventory-item-name"]').textContent();
    
    const firstProductPriceText = await firstProduct.locator('[data-test="inventory-item-price"]').textContent();
    const secondProductPriceText = await secondProduct.locator('[data-test="inventory-item-price"]').textContent();
    
    const firstProductPrice = parseFloat(firstProductPriceText!.replace('$', ''));
    const secondProductPrice = parseFloat(secondProductPriceText!.replace('$', ''));
    
    return {
      firstProductName: firstProductName || '',
      secondProductName: secondProductName || '',
      firstProductPrice,
      secondProductPrice
    };
  }

  async verifyCheckoutSummaryFormat(checkoutPage: any): Promise<void> {
    const actualItemTotal = await checkoutPage.itemTotal.textContent();
    const actualTax = await checkoutPage.tax.textContent();
    const actualTotal = await checkoutPage.total.textContent();
    
    expect(actualItemTotal).toMatch(/Item total: \$\d+\.\d{2}/);
    expect(actualTax).toMatch(/Tax: \$\d+\.\d{2}/);
    expect(actualTotal).toMatch(/Total: \$\d+\.\d{2}/);
  }

  async parseCheckoutSummaryValues(checkoutPage: any): Promise<{
    itemTotalValue: number;
    taxValue: number;
    totalValue: number;
  }> {
    const actualItemTotal = await checkoutPage.itemTotal.textContent();
    const actualTax = await checkoutPage.tax.textContent();
    const actualTotal = await checkoutPage.total.textContent();
    
    const itemTotalValue = parseFloat(actualItemTotal!.replace('Item total: $', ''));
    const taxValue = parseFloat(actualTax!.replace('Tax: $', ''));
    const totalValue = parseFloat(actualTotal!.replace('Total: $', ''));
    
    return {
      itemTotalValue,
      taxValue,
      totalValue
    };
  }
}