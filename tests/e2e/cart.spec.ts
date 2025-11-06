import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { HomePage } from '../../pages/HomePage';
import { AuthHelper } from '../../utils/authHelper';

test.describe('CartPage Tests - With Login', () => {
  let cartPage: CartPage;
  let productsPage: ProductsPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    productsPage = new ProductsPage(page);
    homePage = new HomePage(page);
    
    await AuthHelper.login(page);
  });

  test('Should display empty cart initially', async ({ page }) => {
    await homePage.goToCart();

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    
    const count = await cartPage.getCartItemsCount();
    expect(count).toBe(0);
  });

  test('Should add product to cart and display it', async ({ page }) => {
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    const count = await cartPage.getCartItemsCount();
    expect(count).toBe(1);

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeFalsy();
  });

  test('Should display correct product information in cart', async () => {
    await homePage.goToProducts();
    
    const productName = await productsPage.getProductNameByIndex(0);
    const productPrice = await productsPage.getProductPriceByIndex(0);
    
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    const cartProductName = await cartPage.getProductNameByIndex(0);
    const cartProductPrice = await cartPage.getProductPriceByIndex(0);

    expect(cartProductName).toBe(productName);
    expect(cartProductPrice).toBe(productPrice);
  });

  test('Should add multiple products to cart', async () => {
    await homePage.goToProducts();
    
    await productsPage.addMultipleProductsToCart([0, 1, 2]);
    await homePage.goToCart();

    const count = await cartPage.getCartItemsCount();
    expect(count).toBe(3);
  });

  test('Should verify product exists in cart by name', async () => {
    await homePage.goToProducts();
    
    const productName = await productsPage.getProductNameByIndex(0);
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    const isInCart = await cartPage.isProductInCart(productName);
    expect(isInCart).toBeTruthy();
  });

  test('Should remove product from cart by index', async () => {
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    const countBefore = await cartPage.getCartItemsCount();
    expect(countBefore).toBe(1);

    await cartPage.removeProductByIndex(0);

    const countAfter = await cartPage.getCartItemsCount();
    expect(countAfter).toBe(0);
  });

  test('Should remove product from cart by name', async () => {
    await homePage.goToProducts();
    
    const productName = await productsPage.getProductNameByIndex(0);
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    await cartPage.removeProductByName(productName);

    const isInCart = await cartPage.isProductInCart(productName);
    expect(isInCart).toBeFalsy();
  });

  test('Should remove all products from cart', async () => {
    await homePage.goToProducts();
    await productsPage.addMultipleProductsToCart([0, 1, 2]);
    await homePage.goToCart();

    const countBefore = await cartPage.getCartItemsCount();
    expect(countBefore).toBe(3);

    await cartPage.removeAllProducts();

    const countAfter = await cartPage.getCartItemsCount();
    expect(countAfter).toBe(0);

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });

  test('Should display all product details in cart', async () => {
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    const allProducts = await cartPage.getAllProductsInCart();
    
    expect(allProducts.length).toBe(1);
    expect(allProducts[0].name).toBeTruthy();
    expect(allProducts[0].price).toContain('Rs.');
    expect(allProducts[0].quantity).toBeTruthy();
    expect(allProducts[0].total).toContain('Rs.');

    console.log('Product in cart:', allProducts[0]);
  });

  test('Should verify product quantity and total', async () => {
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    const quantity = await cartPage.getProductQuantityByIndex(0);
    const price = await cartPage.getProductPriceByIndex(0);
    const total = await cartPage.getProductTotalByIndex(0);

    expect(quantity).toBe('1');
    expect(price).toBe(total);
  });

  test('Should calculate total correctly for multiple products', async () => {
    await homePage.goToProducts();
    await productsPage.addMultipleProductsToCart([0, 1]);
    await homePage.goToCart();

    const calculatedTotal = await cartPage.calculateExpectedTotal();
    expect(calculatedTotal).toBeGreaterThan(0);

    console.log(`Total calculated: Rs. ${calculatedTotal}`);
  });

  test('Should proceed to checkout with products in cart', async ({ page }) => {
    
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/.*checkout/);
  });

  test('Should handle removing non-existent product gracefully', async () => {
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    await expect(async () => {
      await cartPage.removeProductByName('NonExistentProduct');
    }).rejects.toThrow('Product "NonExistentProduct" not found in cart');
  });

  test('Should display correct information for each product in cart', async () => {
    await homePage.goToProducts();
    await productsPage.addMultipleProductsToCart([0, 1, 2]);
    await homePage.goToCart();

    const allProducts = await cartPage.getAllProductsInCart();

    allProducts.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`);
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

  test('Should maintain cart after logout and login', async ({ page }) => {
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    const countBefore = await cartPage.getCartItemsCount();
    expect(countBefore).toBe(1);

    await homePage.logout();
    await AuthHelper.login(page);
    await homePage.goToCart();

    const countAfter = await cartPage.getCartItemsCount();
    expect(countAfter).toBe(1);
  });
});