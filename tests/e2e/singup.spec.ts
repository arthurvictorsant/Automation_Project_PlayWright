import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/SignupPage';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';

test.describe('SignupPage Tests', () => {
  let signupPage: SignupPage;
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    await page.goto('https://automationexercise.com');
    await homePage.goToSignupLogin();
  });

  test('Should complete signup with all fields', async ({ page }) => {
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    const name = `Test User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.completeSignup(
      {
        title: 'Mr',
        password: 'Password@123',
        day: '15',
        month: '6',
        year: '1990',
        newsletter: true,
        specialOffers: true,
      },
      {
        firstName: 'Test',
        lastName: 'User',
        company: 'Test Company',
        address1: '123 Test Street',
        address2: 'Apt 4B',
        country: 'India',
        state: 'Test State',
        city: 'Test City',
        zipcode: '12345',
        mobileNumber: '1234567890',
      }
    );

    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();

  });

  test('Should complete signup with minimum required fields', async ({ page }) => {
    const timestamp = Date.now();
    const email = `minimal${timestamp}@example.com`;
    const name = `Minimal User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.fillAccountInformation({
      title: 'Mrs',
      password: 'Pass123',
      day: '1',
      month: '1',
      year: '2000',
    });

    await signupPage.fillAddressInformation({
      firstName: 'Jane',
      lastName: 'Doe',
      address1: '456 Main St',
      country: 'India',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90001',
      mobileNumber: '9876543210',
    });

    await signupPage.createAccount();
    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();
  });

  test('Should select Mr title', async ({ page }) => {
    const timestamp = Date.now();
    const email = `mr${timestamp}@example.com`;
    const name = `Mr User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.selectTitle('Mr');

    const isChecked = await signupPage.titleMr.isChecked();
    expect(isChecked).toBeTruthy();
  });

  test('Should select Mrs title', async ({ page }) => {
    const timestamp = Date.now();
    const email = `mrs${timestamp}@example.com`;
    const name = `Mrs User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.selectTitle('Mrs');

    const isChecked = await signupPage.titleMrs.isChecked();
    expect(isChecked).toBeTruthy();
  });

  test('Should fill password field', async ({ page }) => {
    const timestamp = Date.now();
    const email = `pass${timestamp}@example.com`;
    const name = `Pass User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    const password = 'SecurePassword123';
    await signupPage.fillPassword(password);

    const passwordValue = await signupPage.password.inputValue();
    expect(passwordValue).toBe(password);
  });

  test('Should select date of birth', async ({ page }) => {
    const timestamp = Date.now();
    const email = `dob${timestamp}@example.com`;
    const name = `DOB User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.selectDateOfBirth('25', '12', '1995');

    const day = await signupPage.dayOfBirth.inputValue();
    const month = await signupPage.monthOfBirth.inputValue();
    const year = await signupPage.yearOfBirth.inputValue();

    expect(day).toBe('25');
    expect(month).toBe('12');
    expect(year).toBe('1995');
  });

  test('Should check newsletter checkbox', async ({ page }) => {
    const timestamp = Date.now();
    const email = `news${timestamp}@example.com`;
    const name = `News User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.checkNewsletter();

    const isChecked = await signupPage.newsletter.isChecked();
    expect(isChecked).toBeTruthy();
  });

  test('Should check special offers checkbox', async ({ page }) => {
    const timestamp = Date.now();
    const email = `offers${timestamp}@example.com`;
    const name = `Offers User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.checkSpecialOffers();

    const isChecked = await signupPage.specialOffers.isChecked();
    expect(isChecked).toBeTruthy();
  });

  test('Should fill all address fields', async ({ page }) => {
    const timestamp = Date.now();
    const email = `address${timestamp}@example.com`;
    const name = `Address User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.fillAddressInformation({
      firstName: 'John',
      lastName: 'Smith',
      company: 'Acme Corp',
      address1: '789 Oak Avenue',
      address2: 'Suite 100',
      country: 'India',
      state: 'New York',
      city: 'New York',
      zipcode: '10001',
      mobileNumber: '5551234567',
    });

    const firstName = await signupPage.firstName.inputValue();
    const lastName = await signupPage.lastName.inputValue();
    const company = await signupPage.company.inputValue();
    const address1 = await signupPage.address1.inputValue();

    expect(firstName).toBe('John');
    expect(lastName).toBe('Smith');
    expect(company).toBe('Acme Corp');
    expect(address1).toBe('789 Oak Avenue');
  });

  test('Should complete signup and continue to homepage', async ({ page }) => {
    const timestamp = Date.now();
    const email = `complete${timestamp}@example.com`;
    const name = `Complete User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.completeSignup(
      {
        title: 'Mr',
        password: 'Test@123',
        day: '10',
        month: '5',
        year: '1985',
        newsletter: false,
        specialOffers: false,
      },
      {
        firstName: 'Complete',
        lastName: 'Test',
        address1: '321 Test Blvd',
        country: 'India',
        state: 'Texas',
        city: 'Austin',
        zipcode: '78701',
        mobileNumber: '5125551234',
      }
    );

    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();

    await signupPage.clickContinue();
    await page.waitForTimeout(2000);

    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    const username = await homePage.getLoggedInUsername();
    expect(username).toContain('Logged in as');
    expect(username).toContain(name);
  });
});

test.describe('SignupPage Tests - Different Scenarios', () => {
  let signupPage: SignupPage;
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    await page.goto('https://automationexercise.com');
    await homePage.goToSignupLogin();
  });

  test('Should signup with Mrs title and newsletter', async ({ page }) => {
    const timestamp = Date.now();
    const email = `mrs.news${timestamp}@example.com`;
    const name = `Mrs News ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.completeSignup(
      {
        title: 'Mrs',
        password: 'MrsPass123',
        day: '20',
        month: '8',
        year: '1988',
        newsletter: true,
      },
      {
        firstName: 'Mary',
        lastName: 'Johnson',
        address1: '555 Elm Street',
        country: 'India',
        state: 'Florida',
        city: 'Miami',
        zipcode: '33101',
        mobileNumber: '3055551234',
      }
    );

    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();
  });

  test('Should signup with Mr title and special offers', async ({ page }) => {
    const timestamp = Date.now();
    const email = `mr.offers${timestamp}@example.com`;
    const name = `Mr Offers ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.completeSignup(
      {
        title: 'Mr',
        password: 'MrPass456',
        day: '5',
        month: '3',
        year: '1992',
        specialOffers: true,
      },
      {
        firstName: 'Robert',
        lastName: 'Williams',
        address1: '999 Pine Road',
        country: 'India',
        state: 'Washington',
        city: 'Seattle',
        zipcode: '98101',
        mobileNumber: '2065559999',
      }
    );

    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();
  });

  test('Should signup with both newsletter and special offers', async ({ page }) => {
    const timestamp = Date.now();
    const email = `both${timestamp}@example.com`;
    const name = `Both User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.completeSignup(
      {
        title: 'Mrs',
        password: 'BothPass789',
        day: '30',
        month: '11',
        year: '1987',
        newsletter: true,
        specialOffers: true,
      },
      {
        firstName: 'Sarah',
        lastName: 'Davis',
        company: 'Tech Solutions',
        address1: '777 Broadway',
        address2: 'Floor 5',
        country: 'India',
        state: 'Massachusetts',
        city: 'Boston',
        zipcode: '02101',
        mobileNumber: '6175557777',
      }
    );

    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();
  });

  test('Should signup with early birth date', async ({ page }) => {
    const timestamp = Date.now();
    const email = `old${timestamp}@example.com`;
    const name = `Old User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.completeSignup(
      {
        title: 'Mr',
        password: 'OldPass111',
        day: '1',
        month: '1',
        year: '1950',
      },
      {
        firstName: 'Senior',
        lastName: 'Citizen',
        address1: '111 Retirement Lane',
        country: 'India',
        state: 'Arizona',
        city: 'Phoenix',
        zipcode: '85001',
        mobileNumber: '6025551111',
      }
    );

    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();
  });

  test('Should signup with recent birth date', async ({ page }) => {
    const timestamp = Date.now();
    const email = `young${timestamp}@example.com`;
    const name = `Young User ${timestamp}`;

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.completeSignup(
      {
        title: 'Mrs',
        password: 'YoungPass222',
        day: '31',
        month: '12',
        year: '2005',
      },
      {
        firstName: 'Young',
        lastName: 'Person',
        address1: '222 Youth Avenue',
        country: 'India',
        state: 'Colorado',
        city: 'Denver',
        zipcode: '80201',
        mobileNumber: '7205552222',
      }
    );

    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();
  });
});

test.describe('SignupPage Tests - Full Flow', () => {
  test('Should complete full user registration flow', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    const timestamp = Date.now();
    const email = `fullflow${timestamp}@example.com`;
    const name = `Full Flow ${timestamp}`;
    const password = 'FullFlow@123';

    await page.goto('https://automationexercise.com');

    await homePage.goToSignupLogin();
    await page.waitForTimeout(1000);

    await loginPage.signup(name, email);
    await page.waitForTimeout(2000);

    await signupPage.completeSignup(
      {
        title: 'Mr',
        password: password,
        day: '15',
        month: '7',
        year: '1990',
        newsletter: true,
        specialOffers: true,
      },
      {
        firstName: 'Full',
        lastName: 'Flow',
        company: 'Flow Company',
        address1: '123 Flow Street',
        address2: 'Suite A',
        country: 'India',
        state: 'Flow State',
        city: 'Flow City',
        zipcode: '12345',
        mobileNumber: '1234567890',
      }
    );

    await page.waitForTimeout(3000);

    const isCreated = await signupPage.isAccountCreated();
    expect(isCreated).toBeTruthy();

    console.log('✅ Account created successfully!');

    await signupPage.clickContinue();
    await page.waitForTimeout(2000);

    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    console.log('✅ User is logged in!');

    await homePage.logout();
    await page.waitForTimeout(2000);

    console.log('✅ User logged out!');

    await loginPage.login(email, password);
    await page.waitForTimeout(2000);

    const isLoggedInAgain = await homePage.isUserLoggedIn();
    expect(isLoggedInAgain).toBeTruthy();

    console.log('✅ User logged in again successfully!');
    console.log('✅ Full registration flow completed!');
  });
});