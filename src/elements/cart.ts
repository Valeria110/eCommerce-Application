import { isNull } from '../utils/utils';
import requestsAPI from './requestsAPI';
import { AppEvents } from './types';

type LineItem = {
  quantity: number;
  // ...
};

class Cart {
  private host: string;

  private projectKey: string;

  customerId: string | undefined;

  id: string | undefined;

  private projectToken: string | undefined;

  version: number | undefined;

  lineItems: LineItem[] = [];

  constructor() {
    this.host = process.env.CTP_API_URL ?? '';
    this.projectKey = process.env.CTP_PROJECT_KEY ?? '';
  }

  // now many items in cart
  get counter() {
    let totalQuantity = 0;
    for (const item of this.lineItems) {
      totalQuantity += item.quantity;
    }
    return totalQuantity;
  }

  private isReadyProjectToken() {
    if (!this.projectToken) {
      console.error("Cart doesn't have project token yet");
      return false;
    }
    return true;
  }

  private isExistCartId() {
    if (!this.id) {
      console.error("Cart doesn't exist or get yet");
      return false;
    }
    return true;
  }

  updateProjectToken(projectToken: string) {
    this.projectToken = projectToken;
  }

  async createCart() {
    if (!this.isReadyProjectToken()) {
      return;
    }
    const response = await fetch(`${this.host}/${this.projectKey}/carts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'USD',
        customerId: this.customerId,
      }),
    });

    const data = await response.json();
    console.log(data);
    this.id = data.id;
    this.version = data.version;
  }

  async getCartId() {
    if (!this.isReadyProjectToken() || !this.customerId) {
      console.error("Cart or Customer ID doesn't exist yet");
      return;
    }
    const response = await fetch(`${this.host}/${this.projectKey}/carts/customer-id=${this.customerId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
      },
    });

    const data = await response.json();
    console.log(data);
    this.id = data.id;
    this.lineItems = data.lineItems;
    document.body.dispatchEvent(new CustomEvent(AppEvents.updateCounterCart));
    this.version = data.version;
  }

  async addProduct(productId: string) {
    if (!this.isReadyProjectToken() || !this.isExistCartId()) {
      return;
    }
    const response = await fetch(`${this.host}/${this.projectKey}/carts/${this.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: this.version,
        actions: [
          {
            action: 'addLineItem',
            productId: productId,
            variantId: 1,
            quantity: 1,
          },
        ],
      }),
    });

    const data = await response.json();
    this.version = data.version;
    this.lineItems = data.lineItems;
    document.body.dispatchEvent(new CustomEvent(AppEvents.updateCounterCart));
    console.log(data);
  }
}

document.body.addEventListener(AppEvents.updateUserName, () => {
  console.log('update project token for cart');
  cart.updateProjectToken(requestsAPI.projectToken ?? '');
  console.log('customerData', requestsAPI.customerData);
  cart.customerId = requestsAPI.customerData.id;
});

document.body.addEventListener(AppEvents.updateCounterCart, () => {
  const cartBtnBadge = document.querySelector('.header__cart-btn-badge');
  isNull<HTMLSpanElement>(cartBtnBadge);
  const itemsInCart = cart.counter;
  console.log(itemsInCart);

  if (itemsInCart) {
    cartBtnBadge.textContent = `${cart.counter}+`;
  }
});

const cart = new Cart();
export default cart;
