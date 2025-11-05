import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto(url: string) {
    await this.page.goto(url);
  }

  // Interactions
  async click(locator: Locator) {
    await locator.click();
  }

  async fill(locator: Locator, text: string) {
    await locator.fill(text);
  }

  async type(locator: Locator, text: string) {
    await locator.type(text);
  }

  async selectOption(locator: Locator, value: string) {
    await locator.selectOption(value);
  }

  async check(locator: Locator) {
    await locator.check();
  }

  async uncheck(locator: Locator) {
    await locator.uncheck();
  }

  // Validations and Getters
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async getValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  // Waits
  async waitForElement(locator: Locator, state: 'visible' | 'hidden' | 'attached' = 'visible') {
    await locator.waitFor({ state });
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  // Utilities
  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  async screenshot(name: string) {
    await this.page.screenshot({ 
      path: `screenshots/${name}.png`, 
      fullPage: true 
    });
  }
}