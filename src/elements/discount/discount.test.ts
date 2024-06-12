import discount from './discount';

describe('discount component', () => {
  const discountElem = discount();

  it('should create an element with the given tag name', () => {
    expect(discountElem.tagName).toBe('DIV');
  });

  it('should assign a class name to the created element', () => {
    expect(discountElem.classList.contains('discount')).toBe(true);
  });

  it('should not return null', () => {
    expect(discount).not.toBeNull();
  });
});
