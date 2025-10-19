import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/products.page';
import { CartPage } from '../pages/yourCart.page';
import { CheckoutPage } from '../pages/checkout.page';

type PageObjects = {
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';


