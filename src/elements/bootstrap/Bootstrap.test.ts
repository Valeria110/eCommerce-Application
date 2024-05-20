import Bootstrap from './Bootstrap';

describe('Bootstrap', () => {
  describe('createElement', () => {
    it('should create an element with the given tag name', () => {
      const element = Bootstrap.createElement('div');
      expect(element.tagName).toBe('DIV');
    });

    it('should assign class names to the created element', () => {
      const element = Bootstrap.createElement('div', 'test-class');
      expect(element.classList.contains('test-class')).toBe(true);
    });

    it('should assign text content to the created element', () => {
      const element = Bootstrap.createElement('div', '', 'test content');
      expect(element.textContent).toBe('test content');
    });
  });

  describe('createDropdownSplitButton', () => {
    it('should create a dropdown split button', () => {
      const dropdown = Bootstrap.createDropdownSplitButton('Test');
      expect(dropdown.mainBtn.textContent).toBe('Test');
      expect(dropdown.dropdownBtn.dataset.bsToggle).toBe('dropdown');
    });
  });

  describe('createNavItem', () => {
    it('should create a nav item', () => {
      const navItem = Bootstrap.createNavItem('Test', 'nav-item');
      expect(navItem.querySelector('a')?.textContent).toBe('Test');
    });
  });

  describe('createButton', () => {
    it('should create a button', () => {
      const button = Bootstrap.createButton('Test');
      expect(button.textContent).toBe('Test');
      expect(button.classList.contains('btn')).toBe(true);
    });
  });

  describe('createOffCanvas', () => {
    it('should create an offcanvas', () => {
      const div = document.createElement('div');
      const offcanvas = Bootstrap.createOffCanvas('test', 'Test', div);
      expect(offcanvas.id).toBe('test');
      expect(offcanvas.querySelector('.offcanvas-title')?.textContent).toBe('Test');
    });
  });
});
