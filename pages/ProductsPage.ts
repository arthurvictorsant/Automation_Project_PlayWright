import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  
   readonly allProductsTitle: Locator;
   readonly searchInput: Locator;
  readonly searchButton: Locator;

   readonly productsList: Locator;
   readonly allProducts: Locator;
   readonly productNames: Locator;
   readonly productPrices: Locator;
  
   readonly viewProductButtons: Locator;
   readonly addToCartButtons: Locator;
  
   readonly continueShoppingButton: Locator;
   readonly viewCartModal: Locator;

  constructor(page: Page) {
    super(page);
    
    this.allProductsTitle = page.locator('.title.text-center');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    
    this.productsList = page.locator('.features_items');
    this.allProducts = page.locator('.single-products');
    this.productNames = page.locator('.productinfo p');
    this.productPrices = page.locator('.productinfo h2');
    
    this.viewProductButtons = page.locator('.choose a').filter({ hasText: 'View Product' });
    this.addToCartButtons = page.locator('.productinfo a.add-to-cart');
    
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartModal = page.getByRole('link', { name: 'View Cart' });
  }

  async goToProductsPage() {
    await this.goto('/products');
  }

  async searchProduct(productName: string) {
    await this.fill(this.searchInput, productName);
    await this.click(this.searchButton);
  }

  async getProductsCount(): Promise<number> {
    return await this.getCount(this.allProducts);
  }

  async getProductNameByIndex(index: number): Promise<string> {
    return await this.getText(this.productNames.nth(index));
  }

  async getProductPriceByIndex(index: number): Promise<string> {
    return await this.getText(this.productPrices.nth(index));
  }

  async getAllProductNames(): Promise<string[]> {
    const count = await this.getProductsCount();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await this.getProductNameByIndex(i);
      names.push(name);
    }
    
    return names;
  }

  async viewProductByIndex(index: number) {
    await this.click(this.viewProductButtons.nth(index));
  }

  async addProductToCartByIndex(index: number) {
    await this.click(this.addToCartButtons.nth(index));
  }

  async addMultipleProductsToCart(indexes: number[]) {
    for (const index of indexes) {
      await this.addProductToCartByIndex(index);
      await this.continueShopping();
      await this.waitForTimeout(500);
    }
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }

  async goToCartFromModal() {
    await this.click(this.viewCartModal);
  }

  
  async isAllProductsTitleVisible(): Promise<boolean> {
    return await this.isVisible(this.allProductsTitle);
  }

  async isProductInList(productName: string): Promise<boolean> {
    const allNames = await this.getAllProductNames();
    return allNames.some(name => name.toLowerCase().includes(productName.toLowerCase()));
  }

  async getSearchedProductsCount(): Promise<number> {
    await this.waitForElement(this.allProducts.first());
    return await this.getProductsCount();
  }
}