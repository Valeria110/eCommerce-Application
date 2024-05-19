jest.mock('../../elements/requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));
import layoutRegistrationPage from './layoutRegistrationPage';

describe('Bootstrap', () => {
  const page = layoutRegistrationPage();
  describe('createElement', () => {
    it('should create an element with the given tag name', () => {
      expect(page.tagName).toBe('FORM');
    });

    it('should assign class names to the created element', () => {
      expect(page.classList.contains('needs-validation')).toBe(true);
    });
  });
});
