import error404Page from './error404Page';

jest.mock('../elements/requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('404 page', () => {
  const errorWrapper = error404Page();
  describe('createElement', () => {
    it('should create an element with the given tag name', () => {
      expect(errorWrapper.tagName).toBe('DIV');
    });

    it('should assign class names to the created element', () => {
      expect(errorWrapper.classList.contains('error-wrapper')).toBe(true);
    });
  });
});
