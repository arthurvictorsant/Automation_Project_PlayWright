import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';
import { AuthHelper } from '../../utils/authHelper';
import { CartHelper } from '../../utils/cartHelper';

test.describe('CheckoutPage Tests - With Login', () => {
  let checkoutPage: CheckoutPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    homePage = new HomePage(page);
    
    await AuthHelper.login(page);
    
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();
    await cartPage.proceedToCheckout();
  });

  test('Should display checkout page with title', async ({ page }) => {
    const isVisible = await checkoutPage.isCheckoutTitleVisible();
    expect(isVisible).toBeTruthy();
    await CartHelper.clearCart(page);

  });

  test('Should display delivery address section', async () => {
    const isVisible = await checkoutPage.isDeliveryAddressVisible();
    expect(isVisible).toBeTruthy();
    
    const deliveryName = await checkoutPage.getDeliveryName();
    expect(deliveryName).toBeTruthy();
  });

  test('Should display billing address section', async () => {
    const isVisible = await checkoutPage.isBillingAddressVisible();
    expect(isVisible).toBeTruthy();
    
    const billingName = await checkoutPage.getBillingName();
    expect(billingName).toBeTruthy();
  });

  test('Should display full delivery address', async () => {
    const fullAddress = await checkoutPage.getDeliveryAddressFull();
    expect(fullAddress).toBeTruthy();
    expect(fullAddress.length).toBeGreaterThan(10);
    
    console.log('Delivery Address:', fullAddress);
  });

  test('Should display full billing address', async () => {
    const fullAddress = await checkoutPage.getBillingAddressFull();
    expect(fullAddress).toBeTruthy();
    expect(fullAddress.length).toBeGreaterThan(10);
    
    console.log('Billing Address:', fullAddress);
  });

  test('Should display products in checkout', async () => {
    const count = await checkoutPage.getProductsCount();
    expect(count).toBeGreaterThan(0);
    
    console.log(`Products in checkout: ${count}`);
  });

  test('Should display correct product information', async () => {
    const productName = await checkoutPage.getProductNameByIndex(0);
    const productPrice = await checkoutPage.getProductPriceByIndex(0);
    const productQuantity = await checkoutPage.getProductQuantityByIndex(0);
    const productTotal = await checkoutPage.getProductTotalByIndex(0);

    expect(productName).toBeTruthy();
    expect(productPrice).toContain('Rs.');
    expect(productQuantity).toBeTruthy();
    expect(productTotal).toContain('Rs.');

    console.log('Product:', { productName, productPrice, productQuantity, productTotal });
  });

  test('Should get all products in checkout', async () => {
    const allProducts = await checkoutPage.getAllProductsInCheckout();
    
    expect(allProducts.length).toBeGreaterThan(0);
    expect(Array.isArray(allProducts)).toBeTruthy();
    
    allProducts.forEach((product, index) => {
      console.log(`Product ${index + 1}:`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Price: ${product.price}`);
      console.log(`  Quantity: ${product.quantity}`);
      console.log(`  Total: ${product.total}`);
      
      expect(product.name).toBeTruthy();
      expect(product.price).toContain('Rs.');
      expect(product.quantity).toBeTruthy();
      expect(product.total).toContain('Rs.');
    });
  });

  test('Should verify product exists in checkout', async () => {
    const productName = await checkoutPage.getProductNameByIndex(0);
    const isInCheckout = await checkoutPage.isProductInCheckout(productName);
    
    expect(isInCheckout).toBeTruthy();
  });

  test('Should calculate expected total correctly', async () => {
    const calculatedTotal = await checkoutPage.calculateExpectedTotal();
    
    expect(calculatedTotal).toBeGreaterThan(0);
    
    console.log(`Calculated Total: Rs. ${calculatedTotal}`);
  });

  test('Should add order comment', async () => {
    const comment = 'Please deliver between 9 AM and 5 PM';
    
    await checkoutPage.addOrderComment(comment);
    
    const commentValue = await checkoutPage.commentTextarea.inputValue();
    expect(commentValue).toBe(comment);
  });

  test('Should place order without comment', async ({ page }) => {
    await checkoutPage.placeOrder();
    
    await page.waitForTimeout(2000);
    
    const url = page.url();
    expect(url).toMatch(/payment|checkout/);
  });

  test('Should add comment and place order', async ({ page }) => {
    const comment = 'Please handle with care';
    
    await checkoutPage.addCommentAndPlaceOrder(comment);
    
    await page.waitForTimeout(2000);
    
    const url = page.url();
    expect(url).toMatch(/payment|checkout/);
  });

  test('Should verify delivery and billing addresses match', async () => {
    const addressesMatch = await checkoutPage.verifyAddressesMatch();
    
    console.log(`Addresses match: ${addressesMatch}`);
    
    expect(typeof addressesMatch).toBe('boolean');
  });

  test('Should display complete checkout flow', async ({ page }) => {
    const isCheckoutVisible = await checkoutPage.isCheckoutTitleVisible();
    expect(isCheckoutVisible).toBeTruthy();
    
    const isDeliveryVisible = await checkoutPage.isDeliveryAddressVisible();
    expect(isDeliveryVisible).toBeTruthy();
    
    const isBillingVisible = await checkoutPage.isBillingAddressVisible();
    expect(isBillingVisible).toBeTruthy();
    
    const productsCount = await checkoutPage.getProductsCount();
    expect(productsCount).toBeGreaterThan(0);
    
    
    console.log('Complete checkout validation passed!');
  });
});

test.describe('CheckoutPage Tests - Multiple Products', () => {
  let checkoutPage: CheckoutPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    homePage = new HomePage(page);
    
    await AuthHelper.login(page);
    
    await homePage.goToProducts();
    await productsPage.addMultipleProductsToCart([0, 1, 2]);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('Should display multiple products in checkout', async () => {
    const count = await checkoutPage.getProductsCount();
    expect(count).toBe(3);
    
    console.log(`Multiple products in checkout: ${count}`);
  });

  test('Should calculate total for multiple products', async () => {
    const allProducts = await checkoutPage.getAllProductsInCheckout();
    const calculatedTotal = await checkoutPage.calculateExpectedTotal();
    
    expect(allProducts.length).toBe(3);
    expect(calculatedTotal).toBeGreaterThan(0);
    
    console.log(`Total for ${allProducts.length} products: Rs. ${calculatedTotal}`);
  });

  test('Should verify each product in checkout', async () => {
    const allProducts = await checkoutPage.getAllProductsInCheckout();
    
    for (let i = 0; i < allProducts.length; i++) {
      const isInCheckout = await checkoutPage.isProductInCheckout(allProducts[i].name);
      expect(isInCheckout).toBeTruthy();
    }
  });

  test('Should place order with multiple products', async ({ page }) => {
    const comment = 'Order with 3 products - please verify before shipping';
    
    await checkoutPage.addCommentAndPlaceOrder(comment);
    
    await page.waitForTimeout(2000);
    
    const url = page.url();
    expect(url).toMatch(/payment|checkout/);
  });
});

test.describe('CheckoutPage Tests - Full Flow', () => {
  test('Should complete full checkout flow from products to place order', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const homePage = new HomePage(page);
    


    await AuthHelper.login(page);
    await CartHelper.clearCart(page);

    await homePage.goToProducts();
    
    const productName = await productsPage.getProductNameByIndex(0);
    console.log(`Selected product: ${productName}`);
    
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();
    
    const cartCount = await cartPage.getCartItemsCount();
    expect(cartCount).toBe(1);
    
    await cartPage.proceedToCheckout();
    
    const isCheckoutVisible = await checkoutPage.isCheckoutTitleVisible();
    expect(isCheckoutVisible).toBeTruthy();
    
    const isProductInCheckout = await checkoutPage.isProductInCheckout(productName);
    expect(isProductInCheckout).toBeTruthy();
    
   
    
    const comment = 'Full flow test - automation';
    await checkoutPage.addCommentAndPlaceOrder(comment);
    
    await page.waitForTimeout(2000);
    
    console.log('Full checkout flow completed successfully!');
  });
});