import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly password: Locator;
  readonly dayOfBirth: Locator;
  readonly monthOfBirth: Locator;
  readonly yearOfBirth: Locator;
  readonly newsletter: Locator;
  readonly specialOffers: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address1: Locator;
  readonly address2: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobileNumber: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedTitle: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.password = page.locator('#password');
    this.dayOfBirth = page.locator('#days');
    this.monthOfBirth = page.locator('#months');
    this.yearOfBirth = page.locator('#years');
    this.newsletter = page.locator('#newsletter');
    this.specialOffers = page.locator('#optin');
    this.firstName = page.locator('#first_name');
    this.lastName = page.locator('#last_name');
    this.company = page.locator('#company');
    this.address1 = page.locator('#address1');
    this.address2 = page.locator('#address2');
    this.country = page.locator('#country');
    this.state = page.locator('#state');
    this.city = page.locator('#city');
    this.zipcode = page.locator('#zipcode');
    this.mobileNumber = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
    this.accountCreatedTitle = page.locator('h2[data-qa="account-created"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
  }

  async selectTitle(title: 'Mr' | 'Mrs') {
    if (title === 'Mr') {
      await this.check(this.titleMr);
    } else {
      await this.check(this.titleMrs);
    }
  }

  async fillPassword(password: string) {
    await this.fill(this.password, password);
  }

  async selectDateOfBirth(day: string, month: string, year: string) {
    await this.selectOption(this.dayOfBirth, day);
    await this.selectOption(this.monthOfBirth, month);
    await this.selectOption(this.yearOfBirth, year);
  }

  async checkNewsletter() {
    await this.check(this.newsletter);
  }

  async checkSpecialOffers() {
    await this.check(this.specialOffers);
  }

  async fillAccountInformation(data: {
    title: 'Mr' | 'Mrs';
    password: string;
    day: string;
    month: string;
    year: string;
    newsletter?: boolean;
    specialOffers?: boolean;
  }) {
    await this.selectTitle(data.title);
    await this.fillPassword(data.password);
    await this.selectDateOfBirth(data.day, data.month, data.year);

    if (data.newsletter) {
      await this.checkNewsletter();
    }

    if (data.specialOffers) {
      await this.checkSpecialOffers();
    }
  }

  async fillAddressInformation(data: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }) {
    await this.fill(this.firstName, data.firstName);
    await this.fill(this.lastName, data.lastName);

    if (data.company) {
      await this.fill(this.company, data.company);
    }

    await this.fill(this.address1, data.address1);

    if (data.address2) {
      await this.fill(this.address2, data.address2);
    }

    await this.selectOption(this.country, data.country);
    await this.fill(this.state, data.state);
    await this.fill(this.city, data.city);
    await this.fill(this.zipcode, data.zipcode);
    await this.fill(this.mobileNumber, data.mobileNumber);
  }

  async completeSignup(accountData: {
    title: 'Mr' | 'Mrs';
    password: string;
    day: string;
    month: string;
    year: string;
    newsletter?: boolean;
    specialOffers?: boolean;
  }, addressData: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }) {
    await this.fillAccountInformation(accountData);
    await this.fillAddressInformation(addressData);
    await this.createAccount();
  }

  async createAccount() {
    await this.scrollToElement(this.createAccountButton);
    await this.click(this.createAccountButton);
  }

  async clickContinue() {
    await this.click(this.continueButton);
  }

  async isAccountCreated(): Promise<boolean> {
    return await this.isVisible(this.accountCreatedTitle);
  }

  async getAccountCreatedMessage(): Promise<string> {
    return await this.getText(this.accountCreatedTitle);
  }
}