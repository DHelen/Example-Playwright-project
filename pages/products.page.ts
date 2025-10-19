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

  async addProductByNameAndGoToCart(productName: string): Promise<void> {
    const productItem = this.products.filter({ hasText: productName });
    const addToCartButton = productItem.getByRole('button', { name: 'Add to cart' });
    await addToCartButton.click();

    await this.cartIcon.click();
    await this.page.waitForURL('**/cart.html');
  }


  async addProductsByNameAndGoToCart(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      const productItem = this.products.filter({ hasText: productName });
      const addToCartButton = productItem.getByRole('button', { name: 'Add to cart' });
      await addToCartButton.click();
    }
    
    await this.cartIcon.click();
    await this.page.waitForURL('**/cart.html');
  }


  async getFirstTwoProductsFormattedInfo(): Promise<{
    firstProductName: string;
    secondProductName: string;
    firstProductPrice: string;
    secondProductPrice: string;
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
      firstProductPrice: `$${firstProductPrice.toFixed(2)}`,
      secondProductPrice: `$${secondProductPrice.toFixed(2)}`
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

  async verifyProductsSortedBy(sortType: 'nameAZ' | 'nameZA' | 'priceLowHigh' | 'priceHighLow'): Promise<void> {
    const products = await this.products.all();
    
    if (sortType === 'nameAZ' || sortType === 'nameZA') {
      // Verify name sorting
      const productNames: string[] = [];
      
      for (const product of products) {
        const name = await product.locator('[data-test="inventory-item-name"]').textContent();
        if (name) productNames.push(name);
      }
      
      const sortedNames = sortType === 'nameAZ' 
        ? [...productNames].sort()
        : [...productNames].sort().reverse();
      
      expect(productNames).toEqual(sortedNames);
    } else {
      // Verify price sorting
      const productPrices: number[] = [];
      
      for (const product of products) {
        const priceText = await product.locator('[data-test="inventory-item-price"]').textContent();
        if (priceText) {
          const price = parseFloat(priceText.replace('$', ''));
          productPrices.push(price);
        }
      }
      
      const sortedPrices = sortType === 'priceLowHigh'
        ? [...productPrices].sort((a, b) => a - b)
        : [...productPrices].sort((a, b) => b - a);
      
      expect(productPrices).toEqual(sortedPrices);
    }
  }
}