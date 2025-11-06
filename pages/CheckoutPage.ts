import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly deliveryAddressSection: Locator;
  readonly billingAddressSection: Locator;
  readonly deliveryName: Locator;
  readonly deliveryAddress: Locator;
  readonly billingName: Locator;
  readonly billingAddress: Locator;
  readonly cartInfoTable: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productQuantities: Locator;
  readonly productTotals: Locator;
  readonly subtotal: Locator;
  readonly totalAmount: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderButton: Locator;
  readonly checkoutTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.deliveryAddressSection = page.locator('#address_delivery');
    this.billingAddressSection = page.locator('#address_invoice');
    this.deliveryName = page.locator('#address_delivery .address_firstname');
    this.deliveryAddress = page.locator('#address_delivery .address_address1');
    this.billingName = page.locator('#address_invoice .address_firstname');
    this.billingAddress = page.locator('#address_invoice .address_address1');
    this.cartInfoTable = page.locator('#cart_info');
    this.productNames = page.locator('.cart_description h4 a');
    this.productPrices = page.locator('.cart_price p');
    this.productQuantities = page.locator('.cart_quantity button');
    this.productTotals = page.locator('.cart_total_price');
    this.subtotal = page.locator('.cart_total_price');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a[href="/payment"]');
    this.checkoutTitle = page.locator('.heading').first();
  }

  async goToCheckout() {
    await this.goto('/checkout');
  }

  async getDeliveryName(): Promise<string> {
    return await this.getText(this.deliveryName);
  }

  async getDeliveryAddress(): Promise<string> {
    return await this.getText(this.deliveryAddress);
  }

  async getBillingName(): Promise<string> {
    return await this.getText(this.billingName);
  }

  async getBillingAddress(): Promise<string> {
    return await this.getText(this.billingAddress);
  }

  async getDeliveryAddressFull(): Promise<string> {
    return await this.getText(this.deliveryAddressSection);
  }

  async getBillingAddressFull(): Promise<string> {
    return await this.getText(this.billingAddressSection);
  }

  async getProductsCount(): Promise<number> {
    try {
      return await this.getCount(this.productNames);
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

  async getAllProductsInCheckout(): Promise<Array<{
    name: string;
    price: string;
    quantity: string;
    total: string;
  }>> {
    const count = await this.getProductsCount();
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

  async getTotalAmount(): Promise<string> {
    return await this.getText(this.totalAmount);
  }

  async calculateExpectedTotal(): Promise<number> {
    const products = await this.getAllProductsInCheckout();
    let total = 0;

    for (const product of products) {
      const totalValue = parseFloat(
        product.total.replace('Rs. ', '').replace(',', '')
      );
      total += totalValue;
    }

    return total;
  }

  async addOrderComment(comment: string) {
    await this.fill(this.commentTextarea, comment);
  }

  async placeOrder() {
    await this.click(this.placeOrderButton);
  }

  async addCommentAndPlaceOrder(comment: string) {
    await this.addOrderComment(comment);
    await this.placeOrder();
  }

  async isCheckoutTitleVisible(): Promise<boolean> {
    return await this.isVisible(this.checkoutTitle);
  }

  async isDeliveryAddressVisible(): Promise<boolean> {
    return await this.isVisible(this.deliveryAddressSection);
  }

  async isBillingAddressVisible(): Promise<boolean> {
    return await this.isVisible(this.billingAddressSection);
  }

  async isProductInCheckout(productName: string): Promise<boolean> {
    const count = await this.getProductsCount();

    for (let i = 0; i < count; i++) {
      const name = await this.getProductNameByIndex(i);
      if (name.toLowerCase().includes(productName.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  async verifyAddressesMatch(): Promise<boolean> {
    const deliveryAddress = await this.getDeliveryAddressFull();
    const billingAddress = await this.getBillingAddressFull();
    
    return deliveryAddress === billingAddress;
  }
}