import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {

    private readonly signupLoginLink: Locator;
    private readonly logoutLink: Locator;
    private readonly productsLink: Locator;
    private readonly cartLink: Locator;

    private readonly loggedInUser: Locator;
    private readonly deleteAccountLink: Locator;

    private readonly subscriptionEmail: Locator;
    private readonly subscriptionButton: Locator;
    private readonly successSubscriptionMessage: Locator;

    constructor(page: Page){
        super(page)


  this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
  this.logoutLink = page.getByRole('link', { name: 'Logout' });
  this.productsLink = page.getByRole('link', { name: 'Products' });
  this.cartLink = page.getByRole('link', { name: ' Cart' }); // ← CORRIGIDO
  
  this.loggedInUser = page.locator('a:has-text("Logged in as")');
  this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
  
  this.subscriptionEmail = page.locator('#susbscribe_email');
  this.subscriptionButton = page.locator('#subscribe');
  this.successSubscriptionMessage = page.locator('.alert-success');
    }

   async goToSignupLogin() {
  await this.click(this.signupLoginLink);
}

    async goToProducts(){
        await this.click(this.productsLink);
    }

    async goToCart(){
        await this.click(this.cartLink)
    }

      async logout() {
    await this.click(this.logoutLink);
  }

  async deleteAccount() {
    await this.click(this.deleteAccountLink);
  }

  async subscribeNewsletter(email: string) {
    await this.fill(this.subscriptionEmail, email);
    await this.click(this.subscriptionButton);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.loggedInUser);
  }

  async getLoggedInUsername(): Promise<string> {
    return await this.getText(this.loggedInUser);
  }

  async isSubscriptionSuccessful(): Promise<boolean> {
    return await this.isVisible(this.successSubscriptionMessage);
  }
}   