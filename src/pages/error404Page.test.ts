import { error404Page } from './error404Page';

describe('Bootstrap', () => {
  const errorWrapper = error404Page()[1];
  describe('createElement', () => {
    it('should create an element with the given tag name', () => {
      expect(errorWrapper.tagName).toBe('DIV');
    });

    it('should assign class names to the created element', () => {
      expect(errorWrapper.classList.contains('error-wrapper')).toBe(true);
    });
  });
});
