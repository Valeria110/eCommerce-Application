import basketPage from './basketPage';

jest.mock('../../elements/requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('discount component', () => {
  const basketPageContainer = basketPage();

  it('should create an element with the given tag name', () => {
    expect(basketPageContainer.tagName).toBe('DIV');
  });

  it('should assign class names to the created element', () => {
    expect(basketPageContainer.classList.contains('basketPage')).toBe(true);
  });

  it('should not return null', () => {
    expect(basketPageContainer).not.toBeNull();
  });
});
