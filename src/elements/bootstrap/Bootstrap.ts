import './orange.scss';
import './style-default.scss';

interface DropdownSplitElement {
  btnGroup: HTMLDivElement;
  mainBtn: HTMLButtonElement;
  dropdownBtn: HTMLButtonElement;
  dropdownMenu: HTMLUListElement;
}

export default class Bootstrap {
  static createElement<T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    className: string | string[] = '',
    textContent?: string,
  ): HTMLElementTagNameMap[T] {
    const element = document.createElement(tagName);
    if (typeof className === 'string') {
      element.className = className;
    }
    if (Array.isArray(className)) {
      className.forEach((classItem) => {
        element.classList.add(classItem);
      });
    }
    if (textContent !== undefined) {
      element.textContent = textContent;
    }
    return element as HTMLElementTagNameMap[T];
  }

  static createDropdownSplitButton(
    textContent: string,
    classBtnName = 'btn-orange',
    classDropdown = 'dropdown-orange',
  ): DropdownSplitElement {
    const btnGroup = this.createElement('div', 'btn-group');
    const mainBtn = this.createElement('button', 'btn ' + classBtnName, textContent);
    const dropdownBtn = this.createElement('button', 'btn dropdown-toggle dropdown-toggle-split ' + classBtnName);
    dropdownBtn.dataset.bsToggle = 'dropdown';
    dropdownBtn.setAttribute('aria-expanded', 'false');
    const dropdownMenu = this.createElement('ul', 'dropdown-menu dropdown-menu-end ' + classDropdown);

    btnGroup.append(mainBtn, dropdownBtn, dropdownMenu);
    return { btnGroup, mainBtn, dropdownBtn, dropdownMenu };
  }

  static createNavItem(
    text: string,
    liClass: 'nav-item' | 'dropdown-item',
    isActive = false,
    isDisabled = false,
    className = '',
  ) {
    const li = this.createElement('li', liClass + ' ' + className);
    if (isActive) {
      li.classList.add('active');
    }

    const a = this.createElement('a', 'nav-link', text);
    a.href = '#';
    if (isDisabled) {
      a.classList.add('disabled');
    }
    li.append(a);
    return li;
  }

  static createButton(textContent: string, className = ''): HTMLButtonElement {
    const button = Bootstrap.createElement('button', className);
    button.type = 'button';
    button.classList.add('btn');
    button.textContent = textContent;
    return button;
  }
}
