jest.mock('../requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

import header from './header';
import requestsAPI from '../requestsAPI';
import { Pages } from '../types';

describe('Header', () => {
  let element: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    element = header(Pages.Main);
  });

  describe('createElement', () => {
    it('should create an element with the given tag name', () => {
      expect(element.tagName).toBe('NAV');
    });

    it('should assign class names to the created element', () => {
      expect(element.classList.contains('header')).toBe(true);
      expect(element.classList.contains('navbar')).toBe(true);
    });

    it('should include the correct user email in the element', () => {
      const emailElement = element.querySelector('.userCard__contactInfo')!;
      expect(emailElement).not.toBeNull();
      expect(emailElement.textContent).toBe(requestsAPI.customerData.email);
    });

    it('should include the correct user full name in the element', () => {
      const fullNameElement = element.querySelector('.userCard__fullName')!;
      expect(fullNameElement).not.toBeNull();
      expect(fullNameElement.textContent).toBe(
        `${requestsAPI.customerData.firstName} ${requestsAPI.customerData.lastName}`,
      );
    });
  });
});
