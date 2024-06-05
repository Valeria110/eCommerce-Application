import { loginPage } from './loginPage';

jest.mock('../elements/requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('login page', () => {
  const errorWrapper = loginPage();
  describe('createElement', () => {
    it('should create an element with the given tag name', () => {
      expect(errorWrapper.tagName).toBe('MAIN');
    });

    it('should assign class names to the created element', () => {
      expect(errorWrapper.classList.contains('login-page-main')).toBe(true);
    });
  });
});
