import { Page, Locator } from '@playwright/test';
import { expect } from '../fixtures/fixtures';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly title: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.title = page.locator('[data-test="title"]');
    this.error = page.getByText('Epic sadface: Username and password do not match any user in this service');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async successLogin() {
    await this.goto();
    await this.login('standard_user', 'secret_sauce');
    await expect(this.title).toHaveText('Products');
  }
}