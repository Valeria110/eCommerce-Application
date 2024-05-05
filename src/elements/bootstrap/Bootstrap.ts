export default class Bootstrap {
  private static uniqId = 0;

  static getUniqId() {
    return this.uniqId++;
  }

  static createElement<T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    className = '',
    textContent?: string,
  ): HTMLElementTagNameMap[T] {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (textContent !== undefined) {
      element.textContent = textContent;
    }
    return element as HTMLElementTagNameMap[T];
  }

  static createButton(textContent: string, className = '', clickHandler?: (event: Event) => void): HTMLButtonElement {
    const button = Bootstrap.createElement('button', className);
    button.type = 'button';
    button.classList.add('btn');
    button.textContent = textContent;
    if (typeof clickHandler === 'function') {
      button.addEventListener('click', clickHandler);
    }
    return button;
  }
}
