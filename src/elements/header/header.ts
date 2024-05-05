/* eslint-disable @typescript-eslint/no-use-before-define */ // TODO: in bootstrap object
import Bootstrap from '../bootstrap/Bootstrap';
import logoSrc from './../../img/logo.svg';
import cartSrc from './../../img/cart.svg';
import profileSrc from './../../img/profile-light.svg';
import burgerSrc from './../../img/burger-menu.svg';
import './header.scss';

export default function header(): HTMLElement {
  const headerElement = Bootstrap.createElement('nav', 'header navbar bg-body-tertiary');
  const headerContainer = Bootstrap.createElement('div', 'container-fluid');

  const brand = Bootstrap.createElement('a', 'navbar-brand', 'LitHub');
  brand.href = '#';
  const logo = Bootstrap.createElement('img', 'd-inline-block align-top');
  logo.src = logoSrc as string;
  brand.prepend(logo);

  const collapseDiv = Bootstrap.createElement('div', 'navbar-custom-collapse'); // TODO: use this class
  const ul = Bootstrap.createElement('ul', 'navbar-nav');
  ul.append(createNavItem('Main', true));
  ul.append(createNavItem('Catalog', false, true));
  ul.append(createNavItem('About us', false, true));
  collapseDiv.append(ul);

  const cartBtn = createButton('', '');
  const cartImg = Bootstrap.createElement('img', 'd-inline-block align-top');
  cartImg.src = cartSrc as string;
  cartBtn.prepend(cartImg);

  const profileBtn = createButton('', '');
  const profileImg = Bootstrap.createElement('img', 'd-inline-block align-top');
  profileImg.src = profileSrc as string;
  profileBtn.prepend(profileImg);

  const burgerBtn = createButton('', '');
  const burgerImg = Bootstrap.createElement('img', 'd-inline-block align-top');
  burgerImg.src = burgerSrc as string;
  burgerBtn.prepend(burgerImg);

  const logIn = createDropdownWithButton('Log in', ['Log in', 'Sign up', 'Log out'], 'btn-orange');

  const buttonWrapper = Bootstrap.createElement('div', 'd-flex');
  buttonWrapper.append(cartBtn, profileBtn, logIn, burgerBtn);

  headerContainer.append(brand, collapseDiv, buttonWrapper);
  headerElement.append(headerContainer);
  return headerElement;
}

function createNavItem(
  text = '',
  isActive = false,
  isDisabled = false,
  liClass: 'nav-item' | 'dropdown-item' = 'nav-item',
) {
  const li = Bootstrap.createElement('li', liClass);
  if (isActive) {
    li.classList.add('active');
  }

  const a = Bootstrap.createElement('a', 'nav-link', text);
  a.href = '#';
  if (isDisabled) {
    a.classList.add('disabled');
  }
  li.append(a);
  return li;
}

function createButton(textContent: string, className = '', clickHandler?: (event: Event) => void): HTMLButtonElement {
  const button = Bootstrap.createElement('button', className);
  button.type = 'button';
  button.classList.add('btn');
  button.textContent = textContent;
  if (typeof clickHandler === 'function') {
    button.addEventListener('click', clickHandler);
  }
  return button;
}

function createDropdownWithButton(
  textContent: string,
  dropdownContent: string[],
  classBtnName = '',
  clickHandler?: (event: Event) => void,
): HTMLDivElement {
  // TODO: Class arguments vague
  const dropdown = Bootstrap.createElement('div', 'dropdown dropdown-orange');

  const button = Bootstrap.createElement('button', classBtnName);
  button.type = 'button';
  button.classList.add('btn');
  button.classList.add('dropdown-toggle');
  button.dataset.bsToggle = 'dropdown';
  button.setAttribute('aria-expanded', 'false');
  button.textContent = textContent;
  if (typeof clickHandler === 'function') {
    button.addEventListener('click', clickHandler);
  }

  const dropdownMenu = Bootstrap.createElement('ul', 'dropdown-menu');
  dropdownContent.forEach((text) => {
    const newElement = createNavItem(text, false, false, 'dropdown-item');
    dropdownMenu.append(newElement);
  });
  dropdown.append(button, dropdownMenu);
  return dropdown;
}

// <div class="dropdown">
//   <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//     Dropdown button
//   </button>
//   <ul class="dropdown-menu">
//     <li><a class="dropdown-item" href="#">Action</a></li>
//     <li><a class="dropdown-item" href="#">Another action</a></li>
//     <li><a class="dropdown-item" href="#">Something else here</a></li>
//   </ul>
// </div>
