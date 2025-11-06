import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';

export class CartHelper {
  static async clearCart(page: Page) {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    
    await homePage.goToCart();
    await page.waitForLoadState('networkidle');
    
    const isEmpty = await cartPage.isCartEmpty();
    
    if (!isEmpty) {
      await cartPage.removeAllProducts();
      await page.waitForTimeout(1000);
    }
  }

  static async ensureCartIsEmpty(page: Page) {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    
    await homePage.goToCart();
    await page.waitForLoadState('networkidle');
    
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      const isEmpty = await cartPage.isCartEmpty();
      
      if (isEmpty) {
        break;
      }
      
      await cartPage.removeAllProducts();
      await page.waitForTimeout(1500);
      attempts++;
    }
  }
}