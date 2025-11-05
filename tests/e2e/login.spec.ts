import { LoginPage } from './../../pages/LoginPage';
import { test, expect } from '@playwright/test';

test.describe('Login tests', () =>{
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) =>{

        loginPage = new LoginPage(page);
        await page.goto('https://automationexercise.com/login')

    });

    test('Should login with valid credentials', async ({ page }) => {

        const email = 'emaildaautomacaoplaywrightprogit@yopmail.com';
        const password = 'Senha@123'

        await loginPage.login(email, password);

       await expect(page.locator('a[href="/logout"]')).toBeVisible();


    })

     test('Should show error with invalid credentials', async () => {
    const email = 'invalid@example.com';
    const password = 'wrongpassword';

    await loginPage.login(email, password);

    const isErrorVisible = await loginPage.isLoginErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    
    const errorMessage = await loginPage.getLoginErrorMessage();
    expect(errorMessage).toContain('Your email or password is incorrect!');
  });

})