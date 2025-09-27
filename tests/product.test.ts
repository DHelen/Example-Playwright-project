import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/products.page';
import { CartPage } from '../pages/yourCart.page';

test.describe.parallel('Products page - UI tests', () => {

  test('Add one product to the cart', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act
    const firstProductName = await productPage.addOneProductAndGoToCart(cartPage);

    // Assert
    expect (cartPage.yourCartTitle).toHaveText('Your Cart');    
    expect (cartPage.itemQty.first()).toHaveText('1');
    expect (cartPage.itemName.first()).toHaveText(firstProductName);
  })

  test('Add two products to the cart', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act
    const { firstProductName, secondProductName } = await productPage.addTwoProductsAndGoToCart(cartPage);

    // Assert
    expect (cartPage.yourCartTitle).toHaveText('Your Cart');    
    expect (cartPage.itemQty.first()).toHaveText('1');
    expect (cartPage.itemName.first()).toHaveText(firstProductName);
    expect(cartPage.itemQty.nth(1)).toHaveText('1');
    expect (cartPage.itemName.nth(1)).toHaveText(secondProductName);
  })

  test('Sort products by name A to Z', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act
    await productPage.sortDropdown.selectOption('az');
    
    // Assert
    const products = await productPage.products.all();
    const productNames: string[] = [];
    
    for (const product of products) {
      const name = await product.locator('[data-test="inventory-item-name"]').textContent();
      if (name) productNames.push(name);
    }
    
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  })

  test('Sort products by name Z to A', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act
    await productPage.sortDropdown.selectOption('za');
    
    // Assert
    const products = await productPage.products.all();
    const productNames: string[] = [];
    
    for (const product of products) {
      const name = await product.locator('[data-test="inventory-item-name"]').textContent();
      if (name) productNames.push(name);
    }
    
    // Verify products are sorted alphabetically Z-A
    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
  })

  test('Sort products by price low to high', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act
    await productPage.sortDropdown.selectOption('lohi');
    
    // Assert
    const products = await productPage.products.all();
    const productPrices: number[] = [];
    
    for (const product of products) {
      const priceText = await product.locator('[data-test="inventory-item-price"]').textContent();
      if (priceText) {
      
        const price = parseFloat(priceText.replace('$', ''));
        productPrices.push(price);
      }
    }
    
    // Verify products are sorted by price low to high
    const sortedPrices = [...productPrices].sort((a, b) => a - b);
    expect(productPrices).toEqual(sortedPrices);
    await page.waitForTimeout(3000);
  })

  test('Sort products by price high to low', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act
    await productPage.sortDropdown.selectOption('hilo');
    
    // Assert
    const products = await productPage.products.all();
    const productPrices: number[] = [];
    
    for (const product of products) {
      const priceText = await product.locator('[data-test="inventory-item-price"]').textContent();
      if (priceText) {
      
        const price = parseFloat(priceText.replace('$', ''));
        productPrices.push(price);
      }
    }
    
    // Verify products are sorted by price high to low
    const sortedPrices = [...productPrices].sort((a, b) => b - a);
    expect(productPrices).toEqual(sortedPrices);
    await page.waitForTimeout(3000);
  });
});