import { test, expect } from '../fixtures/fixtures';

test.describe ('Products page - UI tests', () => {

  test('Add one product to the cart', async ({ loginPage, productPage, cartPage }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    const { firstProductName, firstProductPrice } = await test.step('Get first product information', async () => {
      const productInfo = await productPage.getFirstTwoProductsFormattedInfo();
      return {
        firstProductName: productInfo.firstProductName,
        firstProductPrice: productInfo.firstProductPrice
      };
    });

    await test.step('Add one product to cart and navigate to cart', async () => {
      await productPage.addProductByNameAndGoToCart(firstProductName);
    });

    await test.step('Verify cart contains the added product with price', async () => {
      await cartPage.verifyCartContainsProduct(firstProductName, firstProductPrice);
    });
  })

  test('Add two products to the cart', async ({ loginPage, productPage, cartPage }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    const { firstProductName, secondProductName, firstProductPrice, secondProductPrice } = await test.step('Get product information', async () => {
      return await productPage.getFirstTwoProductsFormattedInfo();
    });

    await test.step('Add two products to cart and navigate to cart', async () => {
      await productPage.addProductsByNameAndGoToCart([firstProductName, secondProductName]);
    });

    await test.step('Verify cart contains the two added products with prices', async () => {
      await cartPage.verifyCartContainsProduct(firstProductName, firstProductPrice);
      await cartPage.verifyCartContainsProduct(secondProductName, secondProductPrice);
    });
  })

  test('Sort products by name A to Z', async ({ loginPage, productPage }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    await test.step('Sort products by name A to Z', async () => {
      await productPage.sortDropdown.selectOption('az');
    });
    
    await test.step('Verify products are sorted alphabetically A-Z', async () => {
      await productPage.verifyProductsSortedBy('nameAZ');
    });
  })

  test('Sort products by name Z to A', async ({ loginPage, productPage }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    await test.step('Sort products by name Z to A', async () => {
      await productPage.sortDropdown.selectOption('za');
    });
    
    await test.step('Verify products are sorted alphabetically Z-A', async () => {
      await productPage.verifyProductsSortedBy('nameZA');
    });
  })

  test('Sort products by price low to high', async ({ loginPage, productPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    await test.step('Sort products by price low to high', async () => {
      await productPage.sortDropdown.selectOption('lohi');
    });
    
    await test.step('Verify products are sorted by price low to high', async () => {
      await productPage.verifyProductsSortedBy('priceLowHigh');
    });
  })

  test('Sort products by price high to low', async ({ loginPage, productPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.successLogin();
    });

    await test.step('Sort products by price high to low', async () => {
      await productPage.sortDropdown.selectOption('hilo');
    });
    
    await test.step('Verify products are sorted by price high to low', async () => {
      await productPage.verifyProductsSortedBy('priceHighLow');
    });
  });
});