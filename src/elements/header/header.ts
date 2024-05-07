import Bootstrap from '../bootstrap/Bootstrap';
import logoSrc from './../../img/lithub-logo.svg';
import cartSrc from './../../img/cart.svg';
import profileSrc from './../../img/profile-light.svg';
import burgerSrc from './../../img/burger-menu.svg';
import './header.scss';
import switchPage from '../switchPage';
import { Pages } from '../types';
import userData from '../userData';

enum UserAction {
  LogIn = 'Log in',
  SignUp = 'Sign up',
  LogOut = 'Log out',
}

export default function header(): HTMLElement {
  const headerElement = Bootstrap.createElement('nav', 'header navbar');
  const headerContainer = Bootstrap.createElement('div', 'container-fluid px-0');

  const brand = Bootstrap.createElement('a', 'navbar-brand header__brand', 'LitHub');
  brand.href = '#';
  const logo = Bootstrap.createElement('img', 'd-inline-block align-top');
  logo.src = logoSrc as string;
  brand.prepend(logo);

  const collapseDiv = Bootstrap.createElement('div', 'header__linkCollapse');
  const ul = Bootstrap.createElement('ul', 'navbar-nav');
  ul.append(Bootstrap.createNavItem('Main', 'nav-item', true, false, 'mx-1'));
  ul.append(Bootstrap.createNavItem('Catalog', 'nav-item', false, true, 'mx-1'));
  ul.append(Bootstrap.createNavItem('About us', 'nav-item', false, true, 'mx-1'));
  collapseDiv.append(ul);

  let defaultAction = userData.isLogined ? UserAction.LogOut : UserAction.LogIn;
  const changeDefaultActionBtn = (updateAction: UserAction) => {
    defaultAction = updateAction;
    actionContainer.mainBtn.textContent = defaultAction;
  };

  const actionContainer = Bootstrap.createDropdownSplitButton(defaultAction, 'btn-orange border-0', 'dropdown-orange');
  actionContainer.btnGroup.classList.add('header__actionBtn');
  actionContainer.mainBtn.classList.add('btn-style-default');
  const optionsWithoutLogin = [UserAction.LogIn, UserAction.SignUp].map((text) =>
    Bootstrap.createNavItem(text, 'dropdown-item', false, false, 'dropdown-item-style-default'),
  );
  const optionsWithLogin = [UserAction.LogOut].map((text) =>
    Bootstrap.createNavItem(text, 'dropdown-item', false, false, 'dropdown-item-style-default'),
  );
  actionContainer.dropdownMenu.append(...optionsWithoutLogin, ...optionsWithLogin);
  [...optionsWithoutLogin, ...optionsWithLogin].forEach((element) => {
    element.addEventListener('click', () => {
      const convertAction = textToUserAction(element.textContent ?? '');
      if (convertAction) {
        changeDefaultActionBtn(convertAction);
        clickDefaultActionBtn(defaultAction);
      }
    });
  });
  actionContainer.mainBtn.addEventListener('click', () => {
    clickDefaultActionBtn(defaultAction);
  });

  const cartBtn = createButtonImg(cartSrc as string, 'header__btnImg me-3');
  const profileBtn = createButtonImg(profileSrc as string, 'header__btnImg');
  const burgerBtn = createButtonImg(burgerSrc as string, 'header__burger p-0');

  updateAvailableOptionsLogined(actionContainer, profileBtn, optionsWithLogin, optionsWithoutLogin);

  const buttonWrapper = Bootstrap.createElement('div', 'header__btnWrapper');
  buttonWrapper.append(profileBtn, cartBtn, actionContainer.btnGroup, burgerBtn);

  headerContainer.append(brand, collapseDiv, buttonWrapper);
  headerElement.append(headerContainer);
  return headerElement;
}

function createButtonImg(imgSrc: string, classNameBtn = '') {
  const btn = Bootstrap.createButton('', 'border-0 ' + classNameBtn);
  const img = Bootstrap.createElement('img', 'd-inline-block');
  img.src = imgSrc;
  btn.prepend(img);
  return btn;
}

function updateAvailableOptionsLogined(
  actionContainer: {
    btnGroup: HTMLDivElement;
    mainBtn: HTMLButtonElement;
    dropdownBtn: HTMLButtonElement;
    dropdownMenu: HTMLUListElement;
  },
  profileBtn: HTMLButtonElement,
  optionsWithLogin: HTMLLIElement[],
  optionsWithoutLogin: HTMLLIElement[],
) {
  if (!userData.isLogined) {
    profileBtn.classList.add('d-none');
    optionsWithLogin.forEach((element) => element.classList.add('d-none'));
  } else {
    optionsWithoutLogin.forEach((element) => element.classList.add('d-none'));
    if (optionsWithLogin.length <= 1) {
      // if only one option - remove dropdown option
      actionContainer.dropdownBtn.remove();
      actionContainer.dropdownMenu.remove();
    }
  }
}

function clickDefaultActionBtn(chosenActionAction: UserAction) {
  if (chosenActionAction === UserAction.LogIn) {
    switchPage(Pages.LogIn);
  } else if (chosenActionAction === UserAction.SignUp) {
    switchPage(Pages.SignUp);
  } else if (chosenActionAction === UserAction.LogOut) {
    userData.isLogined = false;
    switchPage(Pages.Main);
  } else {
    console.error('problem with default button');
  }
}

function textToUserAction(str: string): UserAction | undefined {
  if ((Object.values(UserAction) as string[]).includes(str)) {
    return str as unknown as UserAction;
  } else {
    console.error('problem with textToUserAction');
    return undefined;
  }
}
