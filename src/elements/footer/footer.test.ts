import footer, { createGithubCart, createContactLink } from './footer';

describe('footer', () => {
  it('should create an element with the given tag name', () => {
    const footerElem = footer();
    expect(footerElem.tagName).toBe('FOOTER');
  });

  it('should not return null', () => {
    expect(footer()).not.toBeNull();
  });

  it('should create an element with the given tag name', () => {
    const link = createGithubCart('test@gmail.com', 'url');
    expect(link.tagName).toBe('A');
  });

  it('should not return null', () => {
    expect(createGithubCart('test@gmail.com', 'url')).not.toBeNull();
  });

  it('should create an element with the given tag name', () => {
    const link = createContactLink('test@gmail.com', 'url');
    expect(link.tagName).toBe('A');
  });

  it('should not return null', () => {
    expect(createContactLink('test@gmail.com', 'url')).not.toBeNull();
  });
});
