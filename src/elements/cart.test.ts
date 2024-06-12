import cart, { Cart, getAttributesValue } from './cart';

jest.mock('./requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('cart object', () => {
  it('should contain the following methods: createCart, getCartId, addProduct, increaseProductQuantity,decreaseProductQuantity, removeProduct, changeProductQuantity', () => {
    expect(cart).toHaveProperty('createCart');
    expect(cart).toHaveProperty('getCartId');
    expect(cart).toHaveProperty('addProduct');
    expect(cart).toHaveProperty('increaseProductQuantity');
    expect(cart).toHaveProperty('decreaseProductQuantity');
    expect(cart).toHaveProperty('removeProduct');
    expect(cart).toHaveProperty('changeProductQuantity');
  });

  it('should be an instance of Cart class', () => {
    expect(cart instanceof Cart).toBeTruthy();
  });

  it('shoult return attribute value if its name is equal to title or author', () => {
    const attributes: {
      name: string;
      value: string | number;
    }[] = [{ name: 'title', value: 12 }];

    expect(typeof getAttributesValue(attributes, 'title') === 'string').toBeTruthy();
  });

  it('shoult return null if attribute name is not equal to title or author', () => {
    const attributes: {
      name: string;
      value: string | number;
    }[] = [{ name: 'price', value: 12 }];

    expect(getAttributesValue(attributes, 'title')).toBeNull();
  });
});
