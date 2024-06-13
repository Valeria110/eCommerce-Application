import product from './product';
import requestsAPI from '../../elements/requestsAPI';
import { Product } from '../../elements/types';

jest.mock('../../elements/requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('Product', () => {
  it('should call getProductsByID with the correct id', async () => {
    const mockProduct: Product = {
      id: '00000000-0000-0000-0000-0000000000000',
      title: 'Test title',
      description: 'Test description',
      slug: 'test-slug',
      author: 'Test author',
      images: ['image1.jpg', 'image2.jpg'],
      prices: {
        regular: 100,
        discounted: 80,
      },
    };
    const testId = '00000000-0000-0000-0000-0000000000000';
    requestsAPI.getProductsByID = jest.fn().mockResolvedValue(mockProduct);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productPage = product(testId, true);

    expect(requestsAPI.getProductsByID).toHaveBeenCalledWith(testId);

    expect(productPage.innerHTML).toContain('Loading...');
  });

  it('should create an element with the given tag name', () => {
    const productPage = product('00000000-0000-0000-0000-0000000000000', true);
    expect(productPage.tagName).toBe('DIV');
  });
});
