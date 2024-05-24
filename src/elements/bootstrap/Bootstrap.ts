import switchPage from '../switchPage';
import { Pages } from '../types';
import './color-default.scss';
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

    if (Array.isArray(className)) {
      className = className.join(' ');
    }
    if (className) {
      element.className = className;
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
    page: Pages | undefined = undefined,
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
    if (page) {
      a.addEventListener('click', (event) => {
        event.preventDefault();
        switchPage(page);
      });
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

  static createOffCanvas(id: string, title: string, bodyContent: HTMLDivElement): HTMLDivElement {
    const offcanvas = Bootstrap.createElement('div', 'offcanvas offcanvas-end');
    offcanvas.tabIndex = -1;
    offcanvas.id = id;
    offcanvas.setAttribute('aria-labelledby', `${id}Label`);

    const header = Bootstrap.createElement('div', 'offcanvas-header');
    const h5 = Bootstrap.createElement('h5', 'offcanvas-title');
    h5.id = `${id}Label`;
    h5.textContent = title;
    header.append(h5);

    const closeButton = this.createButton('', 'btn-close');
    closeButton.setAttribute('data-bs-dismiss', 'offcanvas');
    closeButton.setAttribute('aria-label', 'Close');
    header.append(closeButton);

    offcanvas.append(header);

    const body = Bootstrap.createElement('div', 'offcanvas-body');
    body.append(bodyContent);

    offcanvas.append(body);

    return offcanvas;
  }
}
