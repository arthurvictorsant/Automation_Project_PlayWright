import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { AuthHelper } from '../../utils/authHelper';

test.describe('ProductsPage Tests', () => {
  let productsPage: ProductsPage;
  let homePage: HomePage;
    let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    homePage = new HomePage(page);
    
    await AuthHelper.loginAndGoToProducts(page);
  });

  test('Should display all products page', async () => {
    const isVisible = await productsPage.isAllProductsTitleVisible();
    expect(isVisible).toBeTruthy();
    
    const productsCount = await productsPage.getProductsCount();
    expect(productsCount).toBeGreaterThan(0);
    console.log(`Total products found: ${productsCount}`);
  });

  test('Should search for a product', async () => {

    const searchTerm = 'Tshirt';

    
    await productsPage.searchProduct(searchTerm);

    
    const isProductFound = await productsPage.isProductInList(searchTerm);
    expect(isProductFound).toBeTruthy();
    
    const searchedCount = await productsPage.getSearchedProductsCount();
    expect(searchedCount).toBeGreaterThan(0);
    console.log(`Products found for "${searchTerm}": ${searchedCount}`);
  });

  test('Should get first product name and price', async () => {
    
    const firstProductName = await productsPage.getProductNameByIndex(0);
    const firstProductPrice = await productsPage.getProductPriceByIndex(0);

    
    expect(firstProductName).toBeTruthy();
    expect(firstProductPrice).toBeTruthy();
    expect(firstProductPrice).toContain('Rs.');
    
    console.log(`First product: ${firstProductName} - ${firstProductPrice}`);
  });

  test('Should view product details', async ({ page }) => {
    
    await productsPage.viewProductByIndex(0);

    
    await expect(page).toHaveURL(/.*product_details/);
    await expect(page.locator('.product-information')).toBeVisible();
  });

  test('Should add single product to cart', async () => {
    
    await productsPage.addProductToCartByIndex(0);

   
    await expect(productsPage.continueShoppingButton).toBeVisible();
    await expect(productsPage.viewCartModal).toBeVisible();
  });

  test('Should add product and continue shopping', async () => {
    
    await productsPage.addProductToCartByIndex(0);
    await productsPage.continueShopping();

    const isVisible = await productsPage.isAllProductsTitleVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Should add product and go to cart', async ({ page }) => {
    
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    
    await expect(page).toHaveURL(/.*view_cart/);
  });

  test('Should add multiple products to cart', async ({ page }) => {
    
    const productIndexes = [0, 2, 4]; // 

    
    await productsPage.addMultipleProductsToCart(productIndexes);
    
    
    await homePage.goToCart();

    
    await expect(page).toHaveURL(/.*view_cart/);
    
  });

  test('Should get all product names', async () => {
   
    const allNames = await productsPage.getAllProductNames();

   
    expect(allNames.length).toBeGreaterThan(0);
    expect(Array.isArray(allNames)).toBeTruthy();
    
    
    console.log('First 5 products:');
    allNames.slice(0, 5).forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
  });

  test('Should search and verify specific product exists', async () => {
    
    const searchTerm = 'Blue Top';

    
    await productsPage.searchProduct(searchTerm);
    
    
    const isFound = await productsPage.isProductInList('Blue');
    expect(isFound).toBeTruthy();
  });
});