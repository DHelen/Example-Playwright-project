import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/products.page';
import { CartPage } from '../pages/yourCart.page';
import { CheckoutPage } from '../pages/checkout.page';

test.describe.parallel('Cart page - UI tests', () => {

  test('Add two products to cart and proceed to checkout', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act
    const { firstProductName, secondProductName } = await productPage.addTwoProductsAndGoToCart(cartPage);
    await cartPage.checkoutButton.click();
    await page.waitForURL('**/checkout-step-one.html');

    // Assert 
    expect(page.url()).toContain('checkout-step-one.html');
  });

  test('Add two products to cart and remove one', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');
    const { firstProductName, secondProductName } = await productPage.addTwoProductsAndGoToCart(cartPage);

    // Act
    await expect(cartPage.removeButtons.first()).toBeVisible();
    await expect(cartPage.removeButtons.first()).toBeEnabled();
    const initialCount = await cartPage.itemQty.count();
    await cartPage.removeButtons.first().click();

    // Assert 
    await expect(cartPage.itemQty).toHaveCount(initialCount - 1, { timeout: 10000 });
    expect(cartPage.itemQty).toHaveCount(1);
    expect(cartPage.itemName).toHaveCount(1);
    const remainingProductName = await cartPage.itemName.first().textContent();
    expect([firstProductName, secondProductName]).toContain(remainingProductName);
  });

  test('Add product to cart and continue shopping', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act 
    const productName = await productPage.addOneProductAndGoToCart(cartPage);
    await cartPage.continueShoppingButton.click();

     // Assert 
    await page.waitForURL('**/inventory.html');
    expect(page.url()).toContain('inventory.html');
    expect(loginPage.title).toHaveText('Products');
  });

  test('Add one product to cart and checkout', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act
    const productName = await productPage.addOneProductAndGoToCart(cartPage);
    await cartPage.checkoutButton.click();
    await page.waitForURL('**/checkout-step-one.html');

    // Assert
    expect(page.url()).toContain('checkout-step-one.html');
  });

  test('Add two products, checkout, fill form and verify summary', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    //Get products
    const { firstProductName, secondProductName, firstProductPrice, secondProductPrice } = await productPage.getFirstTwoProductsInfo();

    // Calculate expected values
    const expectedItemTotal = firstProductPrice + secondProductPrice;
    const expectedTax = expectedItemTotal * 0.08; // 8% tax rate
    const expectedTotal = expectedItemTotal + expectedTax;
    
    // Act
    const { firstProductName: cartFirstProductName, secondProductName: cartSecondProductName } = await productPage.addTwoProductsAndGoToCart(cartPage);
    await cartPage.completeCheckoutStepsBeforeFinish(checkoutPage);

    // Assert 
    expect(page.url()).toContain('checkout-step-two.html');

    const productNames = await checkoutPage.productName.allTextContents();
    expect(productNames).toContain(firstProductName);
    expect(productNames).toContain(secondProductName);
    expect(productNames).toHaveLength(2);

    await productPage.verifyCheckoutSummaryFormat(checkoutPage);
    const { itemTotalValue, taxValue, totalValue } = await productPage.parseCheckoutSummaryValues(checkoutPage);

    // Verify calculations match expected values
    expect(itemTotalValue).toBeCloseTo(expectedItemTotal, 2);
    expect(taxValue).toBeCloseTo(expectedTax, 2);
    expect(totalValue).toBeCloseTo(expectedTotal, 2);
    expect(totalValue).toBeCloseTo(itemTotalValue + taxValue, 2);
  });

  test('Complete checkout process and verify order completion', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.title).toHaveText('Products');

    // Act 
    const productName = await productPage.addOneProductAndGoToCart(cartPage);
    await cartPage.completeCheckoutStepsBeforeFinish(checkoutPage);
    await checkoutPage.clickFinish();
    await page.waitForURL('**/checkout-complete.html');

    // Assert 
    expect(page.url()).toContain('checkout-complete.html');
    expect(checkoutPage.thankYouMessage).toHaveText('Thank you for your order!');
    expect(checkoutPage.orderConfirmationMessage).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  });
});
