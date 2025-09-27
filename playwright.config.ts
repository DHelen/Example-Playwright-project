import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use:{
    baseURL:'https://www.saucedemo.com/inventory.html',
    headless: false
  }
  
});