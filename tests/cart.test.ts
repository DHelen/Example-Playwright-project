import { test, expect } from '../fixtures/fixtures';

test.describe('Cart page - UI tests', () => {

  test('Add two products to cart and proceed to checkout', async ({ loginPage, productPage, cartPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    const { firstProductName, secondProductName } = await test.step('Get product information', async () => {
      const productInfo = await productPage.getFirstTwoProductsFormattedInfo();
      return {
        firstProductName: productInfo.firstProductName,
        secondProductName: productInfo.secondProductName
      };
    });

    await test.step('Add two products to cart by name', async () => {
      await productPage.addProductsByNameAndGoToCart([firstProductName, secondProductName]);
    });

    await test.step('Proceed to checkout', async () => {
      await cartPage.checkoutButton.click();
      await page.waitForURL('**/checkout-step-one.html');
    });

    await test.step('Verify checkout page is displayed', async () => {
      expect(page.url()).toContain('checkout-step-one.html');
    });
  });

  test('Add two products to cart and remove one', async ({ loginPage, productPage, cartPage }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    const { firstProductName, secondProductName, firstProductPrice, secondProductPrice } = await test.step('Get product information', async () => {
      return await productPage.getFirstTwoProductsFormattedInfo();
    });

    await test.step('Add two products to cart by name', async () => {
      await productPage.addProductsByNameAndGoToCart([firstProductName, secondProductName]);
    });

    await test.step('Remove first product from cart', async () => {
      const firstProductRemoveButton = cartPage.page.locator('[data-test="inventory-item"]')
        .filter({ hasText: firstProductName })
        .locator('button:has-text("Remove")');
      
      await expect(firstProductRemoveButton).toBeVisible();
      await expect(firstProductRemoveButton).toBeEnabled();
      await firstProductRemoveButton.click();
    });

    await test.step('Verify second product remains in cart with price', async () => {
      await expect(cartPage.itemQty).toHaveCount(1, { timeout: 10000 });
      expect(cartPage.itemName).toHaveCount(1);
      await cartPage.verifyCartContainsProduct(secondProductName, secondProductPrice);
    });
  });

  test('Add product to cart and continue shopping', async ({ loginPage, productPage, cartPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    const { firstProductName } = await test.step('Get first product information', async () => {
      const productInfo = await productPage.getFirstTwoProductsFormattedInfo();
      return { firstProductName: productInfo.firstProductName };
    });

    await test.step('Add one product to cart by name', async () => {
      await productPage.addProductByNameAndGoToCart(firstProductName);
    });

    await test.step('Continue shopping', async () => {
      await cartPage.continueShoppingButton.click();
    });

    await test.step('Verify return to products page', async () => {
      await page.waitForURL('**/inventory.html');
      expect(page.url()).toContain('inventory.html');
      expect(loginPage.title).toHaveText('Products');
    });
  });

  test('Add one product to cart and checkout', async ({ loginPage, productPage, cartPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    const { firstProductName } = await test.step('Get first product information', async () => {
      const productInfo = await productPage.getFirstTwoProductsFormattedInfo();
      return { firstProductName: productInfo.firstProductName };
    });

    await test.step('Add one product to cart by name', async () => {
      await productPage.addProductByNameAndGoToCart(firstProductName);
    });

    await test.step('Proceed to checkout', async () => {
      await cartPage.checkoutButton.click();
      await page.waitForURL('**/checkout-step-one.html');
    });

    await test.step('Verify checkout page is displayed', async () => {
      expect(page.url()).toContain('checkout-step-one.html');
    });
  });

  test('Add two products, checkout, fill form and verify summary', async ({ loginPage, productPage, cartPage, checkoutPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    const { firstProductName, secondProductName, firstProductPrice, secondProductPrice } = await test.step('Get product information', async () => {
      const productInfo = await productPage.getFirstTwoProductsFormattedInfo();
     
      const firstProductPriceRaw = parseFloat(productInfo.firstProductPrice.replace('$', ''));
      const secondProductPriceRaw = parseFloat(productInfo.secondProductPrice.replace('$', ''));
      
      return {
        firstProductName: productInfo.firstProductName,
        secondProductName: productInfo.secondProductName,
        firstProductPrice: firstProductPriceRaw,
        secondProductPrice: secondProductPriceRaw
      };
    });

    await test.step('Calculate expected values', async () => {
      const expectedItemTotal = firstProductPrice + secondProductPrice;
      const expectedTax = expectedItemTotal * 0.08; 
      const expectedTotal = expectedItemTotal + expectedTax;
    });
    
    await test.step('Add products to cart and complete checkout', async () => {
      await productPage.addProductsByNameAndGoToCart([firstProductName, secondProductName]);
      await cartPage.completeCheckoutStepsBeforeFinish(checkoutPage);
    });

    await test.step('Verify checkout summary page', async () => {
      expect(page.url()).toContain('checkout-step-two.html');

      const productNames = await checkoutPage.productName.allTextContents();
      expect(productNames).toContain(firstProductName);
      expect(productNames).toContain(secondProductName);
      expect(productNames).toHaveLength(2);
    });

    await test.step('Verify checkout summary format and calculations', async () => {
      await productPage.verifyCheckoutSummaryFormat(checkoutPage);
      const { itemTotalValue, taxValue, totalValue } = await productPage.parseCheckoutSummaryValues(checkoutPage);

      const expectedItemTotal = firstProductPrice + secondProductPrice;
      const expectedTax = expectedItemTotal * 0.08;
      const expectedTotal = expectedItemTotal + expectedTax;

      expect(itemTotalValue).toBeCloseTo(expectedItemTotal, 2);
      expect(taxValue).toBeCloseTo(expectedTax, 2);
      expect(totalValue).toBeCloseTo(expectedTotal, 2);
      expect(totalValue).toBeCloseTo(itemTotalValue + taxValue, 2);
    });
  });

  test('Complete checkout process and verify order completion', async ({ loginPage, productPage, cartPage, checkoutPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    const { firstProductName } = await test.step('Get first product information', async () => {
      const productInfo = await productPage.getFirstTwoProductsFormattedInfo();
      return { firstProductName: productInfo.firstProductName };
    });

    await test.step('Add product to cart by name', async () => {
      await productPage.addProductByNameAndGoToCart(firstProductName);
    });

    await test.step('Complete checkout process', async () => {
      await cartPage.completeCheckoutStepsBeforeFinish(checkoutPage);
      await checkoutPage.clickFinish();
      await page.waitForURL('**/checkout-complete.html');
    });

    await test.step('Verify order completion', async () => {
      expect(page.url()).toContain('checkout-complete.html');
      expect(checkoutPage.thankYouMessage).toHaveText('Thank you for your order!');
      expect(checkoutPage.orderConfirmationMessage).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    });
  });
});
