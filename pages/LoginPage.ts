import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Signup locators
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;

  // Login locators
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;

  // Error messages
  readonly loginErrorMessage: Locator;
  readonly signupErrorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize Signup locators
    this.signupName = page.locator('input[data-qa="signup-name"]');
    this.signupEmail = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');

    // Initialize Login locators
    this.loginEmail = page.locator('input[data-qa="login-email"]');
    this.loginPassword = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');

    // Initialize error messages
    this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
    this.signupErrorMessage = page.locator('p:has-text("Email Address already exist!")');
  }

  // Login actions
  async login(email: string, password: string) {
    await this.fill(this.loginEmail, email);
    await this.fill(this.loginPassword, password);
    await this.click(this.loginButton);
  }

  // Signup actions
  async signup(name: string, email: string) {
    await this.fill(this.signupName, name);
    await this.fill(this.signupEmail, email);
    await this.click(this.signupButton);
  }

  // Validations
  async isLoginErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.loginErrorMessage);
  }

  async isSignupErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.signupErrorMessage);
  }

  async getLoginErrorMessage(): Promise<string> {
    return await this.getText(this.loginErrorMessage);
  }

  async getSignupErrorMessage(): Promise<string> {
    return await this.getText(this.signupErrorMessage);
  }
}