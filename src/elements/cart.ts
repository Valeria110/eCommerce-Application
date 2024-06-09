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

const cart = new Cart();
export default cart;
