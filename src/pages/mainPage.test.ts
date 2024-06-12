import mainPage from './mainPage';

jest.mock('../elements/requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('main page', () => {
  it('should return an element with the main tag name', () => {
    const main = mainPage();
    expect(main.tagName).toBe('DIV');
  });

  it('should not return null value', () => {
    expect(mainPage()).not.toBeNull();
  });
});
