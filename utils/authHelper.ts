import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

export class AuthHelper {
  static async login(
    page: Page, 
    email: string = 'emaildaautomacaoplaywrightprogit', 
    password: string = 'Senha@123'
  ) {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    await page.goto('https://automationexercise.com');
    await homePage.goToSignupLogin();
    await loginPage.login(email, password);
    
    await homePage.isUserLoggedIn();
  }

  static async loginAndGoToProducts(
    page: Page,
    email: string = 'emaildaautomacaoplaywrightprogit',
    password: string = 'Senha@123'
  ) {
    await this.login(page, email, password);
    
    const homePage = new HomePage(page);
    await homePage.goToProducts();
  }
}