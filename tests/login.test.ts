import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe.parallel('Login page - UI tests', () => {

  test('Login with correct credentials - should be logged in', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Act
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert
    await expect(loginPage.title).toHaveText('Products');
  });

  test('Login with incorrect password - should be validation error', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.login('standard_user', 'secret');

    // Assert
    await expect(loginPage.error).toBeVisible();
  });

  test('Login with incorrect user name  - should be validation error', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Act
    await loginPage.login('standard', 'secret_sauce');

    // Assert
    await expect(loginPage.error).toBeVisible();
  });
});
