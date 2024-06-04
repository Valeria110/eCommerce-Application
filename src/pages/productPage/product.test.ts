import product from './product';
import requestsAPI from '../../elements/requestsAPI';
import { Product } from '../../elements/types';

// Мокаем модуль requestsAPI
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
    // Создаем фиктивные данные для теста
    const mockProduct: Product = {
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

    // Заменяем реализацию getProductsByID на мок-функцию
    requestsAPI.getProductsByID = jest.fn().mockResolvedValue(mockProduct);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productPage = product('48742c0a-2514-4b6d-aee3-7a37d3b15799');

    // Проверяем, что getProductsByID была вызвана с правильным id
    expect(requestsAPI.getProductsByID).toHaveBeenCalledWith('48742c0a-2514-4b6d-aee3-7a37d3b15799');

    expect(productPage.innerHTML).toContain('Loading...');

    // Дополнительные проверки можно добавить здесь
  });

  it('should create an element with the given tag name', () => {
    const productPage = product('48742c0a-2514-4b6d-aee3-7a37d3b15799');
    expect(productPage.tagName).toBe('DIV');
  });
});
