import { userProfilePage } from './userProfilePage';

jest.mock('../../elements/requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
  getCustomerAddresses: () => ({
    billingAddresses: null,
    shippingAddresses: null,
    defBillingAddress: null,
    defShippingAddress: null,
  }),
}));

describe('user profile page', () => {
  const profilePage = userProfilePage();
  describe('createElement', () => {
    it('should create an element with the given tag name', () => {
      expect(profilePage.tagName).toBe('MAIN');
    });

    it('should assign class names to the created element', () => {
      expect(profilePage.classList.contains('user-profile-main')).toBe(true);
    });
  });
});
