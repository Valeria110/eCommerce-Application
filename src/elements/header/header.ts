/* eslint-disable @typescript-eslint/no-use-before-define */ // TODO: in bootstrap object
import Bootstrap from '../bootstrap/Bootstrap';
import logoSrc from './../../img/logo.svg';
import cartSrc from './../../img/cart.svg';
import profileSrc from './../../img/profile-light.svg';
import burgerSrc from './../../img/burger-menu.svg';
import './header.scss';

// TODO: during debag
const isLogined = false;

export default function header(): HTMLElement {
  const headerElement = Bootstrap.createElement('nav', 'header navbar bg-body-tertiary');
  const headerContainer = Bootstrap.createElement('div', 'container-fluid');

  const brand = Bootstrap.createElement('a', 'navbar-brand', 'LitHub');
  brand.href = '#';
  const logo = Bootstrap.createElement('img', 'd-inline-block align-top');
  logo.src = logoSrc as string;
  brand.prepend(logo);

  const collapseDiv = Bootstrap.createElement('div', 'header__linkCollapse'); // TODO: use this class
  const ul = Bootstrap.createElement('ul', 'navbar-nav');
  ul.append(createNavItem('Main', true));
  ul.append(createNavItem('Catalog', false, true));
  ul.append(createNavItem('About us', false, true));
  collapseDiv.append(ul);

  const cartBtn = createButton('', '');
  const cartImg = Bootstrap.createElement('img', 'd-inline-block');
  cartImg.src = cartSrc as string;
  cartBtn.prepend(cartImg);

  const profileBtn = createButton('', '');
  const profileImg = Bootstrap.createElement('img', 'd-inline-block');
  profileImg.src = profileSrc as string;
  profileBtn.prepend(profileImg);

  const burgerBtn = createButton('', 'header__burger');
  const burgerImg = Bootstrap.createElement('img', 'd-inline-block');
  burgerImg.src = burgerSrc as string;
  burgerBtn.prepend(burgerImg);

  const loginContainer = createDropdownWithButton('Log in', 'btn-orange');
  const optionsWithoutLogin: HTMLLIElement[] = ['Log in', 'Sign up'].map((text) =>
    createNavItem(text, false, false, 'dropdown-item'),
  );
  const optionsWithLogin: HTMLLIElement[] = ['Log out'].map((text) =>
    createNavItem(text, false, false, 'dropdown-item'),
  );
  loginContainer.dropdownMenu.append(...optionsWithoutLogin, ...optionsWithLogin);
  optionsWithoutLogin.forEach((element) => {
    element.addEventListener('click', () => console.log('выбрали другую опцию'));
  });

  // TODO: Debag time
  // profileBtn.classList.add('d-none');
  // burgerBtn.classList.add('d-none');
  // cartBtn.classList.add('disabled');

  const updateLogin = () => {
    if (!isLogined) {
      profileBtn.classList.add('d-none');
      optionsWithLogin.forEach((element) => element.classList.add('d-none'));
    }
  };
  updateLogin();

  loginContainer.button.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target) {
      return;
    }
    if (target.classList.contains('dropdown-toggle')) {
      console.log('Нажата иконка dropdown');
    } else {
      console.log('Нажата кнопка');
    }
  });

  const buttonWrapper = Bootstrap.createElement('div', 'header__btnWrapper');
  buttonWrapper.append(cartBtn, profileBtn, loginContainer.dropdown, burgerBtn);

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
  classBtnName = '',
  clickHandler?: (event: Event) => void,
): { dropdown: HTMLDivElement; button: HTMLButtonElement; dropdownMenu: HTMLUListElement } {
  // TODO: Class arguments vague
  const dropdown = Bootstrap.createElement('div', 'dropdown dropdown-orange header__loginDropdown');

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

  const dropdownMenu = Bootstrap.createElement('ul', 'dropdown-menu dropdown-menu-end');
  dropdown.append(button, dropdownMenu);
  return { dropdown, button, dropdownMenu };
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
