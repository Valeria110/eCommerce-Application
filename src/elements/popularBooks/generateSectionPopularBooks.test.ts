import { generateSectionPopularBooks } from './generateSectionPopularBooks';

jest.mock('../requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('popular books section', () => {
  it('should return an element with the main tag name', () => {
    const containerForSectionPopularBook = generateSectionPopularBooks('Text title');
    expect(containerForSectionPopularBook.tagName).toBe('DIV');
  });

  it('should not return null value', () => {
    expect(generateSectionPopularBooks('Text title')).not.toBeNull();
  });

  it('should not return null value', () => {
    const containerForSectionPopularBook = generateSectionPopularBooks('Text title');
    expect(containerForSectionPopularBook.classList.contains('main-page__popular-books-container')).toBeTruthy();
  });
});
