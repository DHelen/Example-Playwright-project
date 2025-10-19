import { test, expect } from '../fixtures/fixtures';

test.describe('Login page - UI tests', () => {

  test('Login with correct credentials - should be logged in', async ({ loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });
    
    await test.step('Login with valid credentials', async () => {
      await loginPage.login('standard_user', 'secret_sauce');
    });

    await test.step('Verify successful login and Products page is displayed', async () => {
      await expect(loginPage.title).toHaveText('Products');
    });
  });

  test('Login with incorrect password - should be validation error', async ({ loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Attempt login with invalid password', async () => {
      await loginPage.login('standard_user', 'secret');
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(loginPage.error).toBeVisible();
    });
  });

  test('Login with incorrect user name  - should be validation error', async ({ loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Attempt login with invalid username', async () => {
      await loginPage.login('standard', 'secret_sauce');
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(loginPage.error).toBeVisible();
    });
  });
});
