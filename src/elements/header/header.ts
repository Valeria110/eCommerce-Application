/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-use-before-define */ // TODO: in bootstrap object
import Bootstrap from '../bootstrap/Bootstrap';
import logoSrc from './../../img/logo.svg';
import cartSrc from './../../img/cart.svg';
import profileSrc from './../../img/profile-light.svg';
import burgerSrc from './../../img/burger-menu.svg';
import './header.scss';

enum UserAction {
  LogIn = 'Log in',
  SignUp = 'Sign up',
  LogOut = 'Log out',
}

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
  ul.append(Bootstrap.createNavItem('Main', true));
  ul.append(Bootstrap.createNavItem('Catalog', false, true));
  ul.append(Bootstrap.createNavItem('About us', false, true));
  collapseDiv.append(ul);

  const cartBtn = Bootstrap.createButton('', '');
  const cartImg = Bootstrap.createElement('img', 'd-inline-block');
  cartImg.src = cartSrc as string;
  cartBtn.prepend(cartImg);

  const profileBtn = Bootstrap.createButton('', '');
  const profileImg = Bootstrap.createElement('img', 'd-inline-block');
  profileImg.src = profileSrc as string;
  profileBtn.prepend(profileImg);

  const burgerBtn = Bootstrap.createButton('', 'header__burger');
  const burgerImg = Bootstrap.createElement('img', 'd-inline-block');
  burgerImg.src = burgerSrc as string;
  burgerBtn.prepend(burgerImg);

  // ------
  let defaultActionBtn = UserAction.LogIn;
  const loginContainer = Bootstrap.createDropdownSplitButton(defaultActionBtn, 'btn-orange');
  const optionsWithoutLogin: HTMLLIElement[] = [UserAction.LogIn, UserAction.SignUp].map((text) =>
    Bootstrap.createNavItem(text, false, false, 'dropdown-item'),
  );
  const optionsWithLogin: HTMLLIElement[] = [UserAction.LogOut].map((text) =>
    Bootstrap.createNavItem(text, false, false, 'dropdown-item'),
  );
  loginContainer.dropdownMenu.append(...optionsWithoutLogin, ...optionsWithLogin);
  [...optionsWithoutLogin, ...optionsWithLogin].forEach((element) => {
    element.addEventListener('click', () => {
      const convertAction = textToUserAction(element.textContent ?? '');
      if (convertAction) {
        defaultActionBtn = convertAction;
        loginContainer.mainBtn.textContent = defaultActionBtn;
        clickDefaultActionBtn();
      }
    });
  });

  const clickDefaultActionBtn = () => {
    console.log(`run script ${defaultActionBtn}`);
  };

  const updateLoginContainer = () => {
    if (!isLogined) {
      profileBtn.classList.add('d-none');
      optionsWithLogin.forEach((element) => element.classList.add('d-none'));
    }
  };
  updateLoginContainer();

  loginContainer.mainBtn.addEventListener('click', () => {
    clickDefaultActionBtn();
  });

  const buttonWrapper = Bootstrap.createElement('div', 'header__btnWrapper');
  buttonWrapper.append(cartBtn, profileBtn, loginContainer.btnGroup, burgerBtn);

  headerContainer.append(brand, collapseDiv, buttonWrapper);
  headerElement.append(headerContainer);
  return headerElement;
}

function textToUserAction(str: string): UserAction | undefined {
  if ((Object.values(UserAction) as string[]).includes(str)) {
    return str as unknown as UserAction;
  } else {
    console.error('problem with textToUserAction');
    return undefined;
  }
}
