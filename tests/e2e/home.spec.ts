import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';

test.describe('HomePage Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto('https://automationexercise.com');
  });

  test('Should navigate to Products page', async ({ page }) => {
    await homePage.goToProducts();

    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('.title.text-center')).toHaveText('All Products');
  });

  test('Should navigate to Cart page', async ({ page }) => {
    await homePage.goToCart();

    await expect(page).toHaveURL(/view_cart/);
  });

  test('Should navigate to Signup/Login page', async ({ page }) => {
    await homePage.goToSignupLogin();

    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('.login-form h2')).toBeVisible();
  });

  test('Should subscribe to newsletter successfully', async () => {
    const email = `test${Date.now()}@example.com`;

    await homePage.subscribeNewsletter(email);

    const isSuccessful = await homePage.isSubscriptionSuccessful();
    expect(isSuccessful).toBeTruthy();
  });

  test('Should show logged in user after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await homePage.goToSignupLogin();
    await loginPage.login('emaildaautomacaoplaywrightprogit@yopmail.com', 'Senha@123');

    await page.goto('https://automationexercise.com');

    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    const username = await homePage.getLoggedInUsername();
    expect(username).toContain('Logged in as');
  });

  test('Should logout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await homePage.goToSignupLogin();
    await loginPage.login('emaildaautomacaoplaywrightprogit@yopmail.com', 'Senha@123');
    await page.goto('https://automationexercise.com');

    await homePage.logout();

    await expect(page).toHaveURL(/.*login/);
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeFalsy();
  });
});