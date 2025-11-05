import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly productImages: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productQuantities: Locator;
  readonly productTotals: Locator;
  readonly removeButtons: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartInfoTable: Locator;
  readonly subscriptionSection: Locator;

  constructor(page: Page) {
    super(page);
    
    this.cartTable = page.locator('#cart_info');
    this.cartItems = page.locator('tbody tr');
    this.productImages = page.locator('.cart_product img');
    this.productNames = page.locator('.cart_description h4 a');
    this.productPrices = page.locator('.cart_price p');
    this.productQuantities = page.locator('.cart_quantity button');
    this.productTotals = page.locator('.cart_total_price');
    this.removeButtons = page.locator('.cart_quantity_delete');
    this.proceedToCheckoutButton = page.locator('.btn.btn-default.check_out');
    this.emptyCartMessage = page.locator('#empty_cart');
    this.cartInfoTable = page.locator('.cart_info_table');
    this.subscriptionSection = page.locator('#footer');
  }

  async goToCart() {
    await this.goto('/view_cart');
  }

  async getCartItemsCount(): Promise<number> {
    try {
      return await this.getCount(this.cartItems);
    } catch {
      return 0;
    }
  }

  async getProductNameByIndex(index: number): Promise<string> {
    return await this.getText(this.productNames.nth(index));
  }

  async getProductPriceByIndex(index: number): Promise<string> {
    return await this.getText(this.productPrices.nth(index));
  }

  async getProductQuantityByIndex(index: number): Promise<string> {
    return await this.getText(this.productQuantities.nth(index));
  }

  async getProductTotalByIndex(index: number): Promise<string> {
    return await this.getText(this.productTotals.nth(index));
  }

  async getAllProductsInCart(): Promise<Array<{
    name: string;
    price: string;
    quantity: string;
    total: string;
  }>> {
    const count = await this.getCartItemsCount();
    const products = [];

    for (let i = 0; i < count; i++) {
      const product = {
        name: await this.getProductNameByIndex(i),
        price: await this.getProductPriceByIndex(i),
        quantity: await this.getProductQuantityByIndex(i),
        total: await this.getProductTotalByIndex(i),
      };
      products.push(product);
    }

    return products;
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const count = await this.getCartItemsCount();
    
    for (let i = 0; i < count; i++) {
      const name = await this.getProductNameByIndex(i);
      if (name.toLowerCase().includes(productName.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemsCount();
    return count === 0;
  }

  async isEmptyCartMessageVisible(): Promise<boolean> {
    try {
      return await this.isVisible(this.emptyCartMessage);
    } catch {
      return false;
    }
  }

  async removeProductByIndex(index: number) {
    await this.click(this.removeButtons.nth(index));
    await this.waitForTimeout(1000);
  }

  async removeProductByName(productName: string) {
    const count = await this.getCartItemsCount();
    
    for (let i = 0; i < count; i++) {
      const name = await this.getProductNameByIndex(i);
      if (name.toLowerCase().includes(productName.toLowerCase())) {
        await this.removeProductByIndex(i);
        return;
      }
    }
    
    throw new Error(`Product "${productName}" not found in cart`);
  }

  async removeAllProducts() {
    let count = await this.getCartItemsCount();
    
    while (count > 0) {
      await this.removeProductByIndex(0);
      count = await this.getCartItemsCount();
    }
  }

  async proceedToCheckout() {
    await this.click(this.proceedToCheckoutButton);
  }

  async calculateExpectedTotal(): Promise<number> {
    const products = await this.getAllProductsInCart();
    let total = 0;

    for (const product of products) {
      const totalValue = parseFloat(product.total.replace('Rs. ', '').replace(',', ''));
      total += totalValue;
    }

    return total;
  }
}