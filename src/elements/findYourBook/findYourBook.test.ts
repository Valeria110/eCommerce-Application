import findYourBook from './findYourBook';

describe('discount component', () => {
  const container = findYourBook();

  it('should create an element with the given tag name', () => {
    expect(container.tagName).toBe('DIV');
  });

  it('should not return null', () => {
    expect(container).not.toBeNull();
  });
});
