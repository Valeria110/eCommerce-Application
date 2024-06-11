import requestsAPI from './requestsAPI';
import { AppEvents, ProductCart } from './types';

function getAttributesValue(
  attributes: {
    name: string;
    value: string | number;
  }[],
  name: 'title' | 'author',
): string | null {
  for (const attribute of attributes) {
    if (attribute.name === name) {
      return String(attribute.value);
    }
  }
  return null;
}

type LineItem = {
  quantity: number;
  id: string;
  productId: string;
  price: {
    id: string;
    value: {
      type: string;
      currencyCode: string;
      centAmount: number;
      fractionDigits: number;
    };
    discounted?: {
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
      discount: {
        typeId: string;
        id: string;
      };
    };
  };
  productSlug: {
    [key: string]: string;
  };
  variant: {
    id: number;
    sku: string;
    key: string;
    prices: Array<{
      id: string;
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
      discounted?: {
        value: {
          type: string;
          currencyCode: string;
          centAmount: number;
          fractionDigits: number;
        };
        discount: {
          typeId: string;
          id: string;
        };
      };
    }>;
    images: Array<{
      url: string;
      dimensions: {
        w: number;
        h: number;
      };
    }>;
    attributes: Array<{
      name: string;
      value: string | number;
    }>;
  };
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

  totalPriceCentAmount: number = 0;

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

  get regularPriceCentAmount() {
    return this.products.reduce((sum, product) => sum + product.prices.regular * product.quantity, 0);
  }

  get products(): ProductCart[] {
    return this.lineItems.map((item) => {
      const attributes = item.variant.attributes;

      const title = getAttributesValue(attributes, 'title') ?? '';
      const regularPrice = item.price.value.centAmount;
      const discountedPrice = item.price.discounted?.value.centAmount ?? regularPrice;
      const author = getAttributesValue(attributes, 'author') ?? '';
      const images = item.variant.images.map((image) => image.url);

      return {
        id: item.id,
        productId: item.productId,
        title,
        author,
        prices: {
          regular: regularPrice,
          discounted: discountedPrice,
        },
        images,
        quantity: item.quantity,
      };
    });
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

  private updateCacheAfterFetch(data: {
    id: string;
    version: number;
    lineItems: LineItem[];
    totalPrice: {
      centAmount: number;
    };
  }) {
    this.id = data.id;
    this.version = data.version;
    this.lineItems = data.lineItems;
    this.totalPriceCentAmount = data.totalPrice.centAmount;

    console.log(data);
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
    this.updateCacheAfterFetch(data);
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
    this.updateCacheAfterFetch(data);
    document.body.dispatchEvent(new CustomEvent(AppEvents.updateCounterCart));
  }

  async addProduct(productId: string) {
    console.log(`try add product ${productId}`); // TODO: del
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
    this.updateCacheAfterFetch(data);
    document.body.dispatchEvent(new CustomEvent(AppEvents.updateCounterCart));
  }

  async increaseProductQuantity(lineItemId: string) {
    const lineItem = this.lineItems.find((item) => item.id === lineItemId);
    if (!lineItem) {
      console.error(`Line item ${lineItemId} not found`);
      return;
    }
    const newQuantity = lineItem.quantity + 1;
    await this.changeProductQuantity(lineItemId, newQuantity);
  }

  async decreaseProductQuantity(lineItemId: string) {
    const lineItem = this.lineItems.find((item) => item.id === lineItemId);
    if (!lineItem) {
      console.error(`Line item ${lineItemId} not found`);
      return;
    }
    const newQuantity = lineItem.quantity - 1;
    if (newQuantity < 0) {
      console.error(`Cannot decrease quantity below 0`);
      return;
    }
    await this.changeProductQuantity(lineItemId, newQuantity);
  }

  async removeProduct(lineItemId: string) {
    const lineItem = this.lineItems.find((item) => item.id === lineItemId);
    if (!lineItem) {
      console.error(`Line item ${lineItemId} not found`);
      return;
    }
    await this.changeProductQuantity(lineItemId, 0);
  }

  async changeProductQuantity(lineItemId: string, newQuantity: number) {
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
            action: 'changeLineItemQuantity',
            lineItemId: lineItemId,
            quantity: newQuantity,
          },
        ],
      }),
    });

    const data = await response.json();
    this.updateCacheAfterFetch(data);
    document.body.dispatchEvent(new CustomEvent(AppEvents.updateCounterCart));
  }
}

document.body.addEventListener(AppEvents.updateUserName, () => {
  cart.updateProjectToken(requestsAPI.projectToken ?? '');
  cart.customerId = requestsAPI.customerData.id;
  cart.getCartId().then(() => {
    document.body.dispatchEvent(new CustomEvent(AppEvents.createCart));
    document.body.dispatchEvent(new CustomEvent(AppEvents.updateCounterCart));
  });
});

const cart = new Cart();
export default cart;
