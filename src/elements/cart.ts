import requestsAPI from './requestsAPI';
import { AppEvents, ProductCart } from './types';

const LOCAL_STORAGE_ANONIM_CART = 'anonimCart';

export function getAttributesValue(
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

type DiscountCode = {
  discountCode: {
    typeId: string;
    id: string;
  };
  state: string;
};

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
  discountedPricePerQuantity?: {
    quantity: number;
    discountedPrice: {
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
      includedDiscounts: Array<{
        discount: {
          typeId: string;
          id: string;
        };
        discountedAmount: {
          type: string;
          currencyCode: string;
          centAmount: number;
          fractionDigits: number;
        };
      }>;
    };
  }[];
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

interface CartData {
  id: string;
  version: number;
  discountCodes?: DiscountCode[];
  lineItems: LineItem[];
  totalPrice: {
    centAmount: number;
  };
  discountOnTotalPrice?: {
    discountedAmount: {
      centAmount: number;
    };
  };
}

export class Cart {
  private host: string;

  private projectKey: string;

  customerId: string | undefined;

  id: string | undefined;

  private projectToken: string | undefined;

  version: number | undefined;

  lineItems: LineItem[] = [];

  totalPriceCentAmount: number = 0;

  discountCodes: string[] = [];

  discountIdName = new Map();

  constructor() {
    this.host = process.env.CTP_API_URL ?? '';
    this.projectKey = process.env.CTP_PROJECT_KEY ?? '';
  }

  clearCacheWhenLogOut() {
    this.id = undefined;
    this.customerId = undefined;
    this.lineItems = [];
    this.discountCodes = [];

    document.body.dispatchEvent(new CustomEvent(AppEvents.updateCounterCart));
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
      const discountedPromo = item.discountedPricePerQuantity?.[0]?.discountedPrice.value.centAmount ?? regularPrice;
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
          discountedPromo,
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

  private updateCacheAfterFetch(response: Response, data: CartData) {
    if (!response.ok) {
      console.error(data);
      return;
    } else {
      // console.log(data);
    }

    this.id = data.id;
    this.version = data.version;
    this.lineItems = data.lineItems;
    this.totalPriceCentAmount = data.totalPrice.centAmount;
    if (data.discountCodes) {
      this.discountCodes = data.discountCodes.map((item) => item.discountCode.id);
    }
    if (!this.customerId && this.id) {
      localStorage.setItem(LOCAL_STORAGE_ANONIM_CART, this.id);
    }
    document.body.dispatchEvent(new CustomEvent(AppEvents.updateCart));
  }

  async clearCart() {
    if (!this.isReadyProjectToken() || !this.isExistCartId()) {
      return;
    }

    const actions = this.lineItems.map((item) => ({
      action: 'changeLineItemQuantity',
      lineItemId: item.id,
      quantity: 0,
    }));

    const response = await fetch(`${this.host}/${this.projectKey}/carts/${this.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: this.version,
        actions,
      }),
    });

    const data = await response.json();
    this.updateCacheAfterFetch(response, data);
  }

  async createCart() {
    if (!this.isReadyProjectToken()) {
      return;
    }

    const cartData: { currency: string; customerId?: string } = {
      currency: 'USD',
    };

    if (this.customerId) {
      cartData.customerId = this.customerId;
    }

    const response = await fetch(`${this.host}/${this.projectKey}/carts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
    });

    const data = await response.json();
    this.updateCacheAfterFetch(response, data);
  }

  async updateCart() {
    if (!this.isReadyProjectToken()) {
      console.error("Cart or Customer ID doesn't exist yet");
      return;
    }

    let urlId = '';
    if (this.customerId) {
      urlId = `customer-id=${this.customerId}`;
    } else if (this.id) {
      urlId = this.id;
    } else {
      console.error('call updateCart() early then id');
    }

    const response = await fetch(`${this.host}/${this.projectKey}/carts/${urlId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok && response.status === 404) {
      if (data.message === `An active cart for the customer ${this.customerId} does not exist.`) {
        // user doesn't have active cart
        return;
      }
    }
    this.updateCacheAfterFetch(response, data);
  }

  async addProduct(productId: string, quantity = 1) {
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
            quantity,
          },
        ],
      }),
    });

    const data = await response.json();
    this.updateCacheAfterFetch(response, data);
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
    this.updateCacheAfterFetch(response, data);
  }

  async applyDiscountCode(discountCode: string): Promise<{ status: boolean; message: string }> {
    if (!this.isReadyProjectToken() || !this.isExistCartId()) {
      return { status: false, message: '' };
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
            action: 'addDiscountCode',
            code: discountCode,
          },
        ],
      }),
    });

    const data = await response.json();
    this.updateCacheAfterFetch(response, data);
    return {
      status: response.ok,
      message: response.ok ? '' : data.message.replace('discount code', 'promocode'),
    };
  }

  async updateDiscountCodes() {
    if (!this.isReadyProjectToken()) {
      return;
    }

    const response = await fetch(`${this.host}/${this.projectKey}/discount-codes`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      data.results.forEach((element: { id: string; code: string }) => {
        this.discountIdName.set(element.id, element.code);
      });
    }
  }

  async afterUpdateUserName() {
    this.updateProjectToken(requestsAPI.projectToken ?? '');
    this.customerId = requestsAPI.customerData.id;
    const anonimCartID = localStorage.getItem(LOCAL_STORAGE_ANONIM_CART);
    this.updateDiscountCodes();

    const mergeCart = async (isShouldCreateCart: boolean) => {
      const itemsInAnonimCart: { productId: string; quantity: number }[] = [];
      this.products.forEach((item) => {
        itemsInAnonimCart.push({ productId: item.productId, quantity: item.quantity });
      });
      if (isShouldCreateCart) {
        await this.createCart();
      }
      for (const item of itemsInAnonimCart) {
        await this.addProduct(item.productId, item.quantity);
      }
      localStorage.removeItem(LOCAL_STORAGE_ANONIM_CART); // remove after merge
    };

    if (this.customerId) {
      // user login, check and merge cart
      if (anonimCartID) {
        await this.updateCart();
        if (this.id === anonimCartID) {
          await mergeCart(true);
        } else {
          await mergeCart(false);
        }
      } else {
        await this.updateCart();
      }
    } else {
      // should create or upload anonim car
      if (anonimCartID) {
        this.id = anonimCartID;
        await this.updateCart();
      }
    }

    document.body.dispatchEvent(new CustomEvent(AppEvents.createCart));
  }
}

document.body.addEventListener(AppEvents.updateUserName, async () => cart.afterUpdateUserName());

const cart = new Cart();
export default cart;
