/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-use-before-define */ // TODO: in bootstrap object
import Bootstrap from '../bootstrap/Bootstrap';
import logoSrc from './../../img/logo.svg';
import cartSrc from './../../img/cart.svg';
import profileSrc from './../../img/profile-light.svg';
import burgerSrc from './../../img/burger-menu.svg';
import './header.scss';
import switchPage from '../switchPage';
import { Pages } from '../types';
import UserData from '../UserData';

enum UserAction {
  LogIn = 'Log in',
  SignUp = 'Sign up',
  LogOut = 'Log out',
}

// TODO: during debag
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
  let defaultAction = UserData.isLogined ? UserAction.LogOut : UserAction.LogIn;
  const changeDefaultActionBtn = (updateAction: UserAction) => {
    defaultAction = updateAction;
    actionContainer.mainBtn.textContent = defaultAction;
  };

  const actionContainer = Bootstrap.createDropdownSplitButton(defaultAction, 'btn-orange');
  const optionsWithoutLogin: HTMLLIElement[] = [UserAction.LogIn, UserAction.SignUp].map((text) =>
    Bootstrap.createNavItem(text, false, false, 'dropdown-item'),
  );
  const optionsWithLogin: HTMLLIElement[] = [UserAction.LogOut].map((text) =>
    Bootstrap.createNavItem(text, false, false, 'dropdown-item'),
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

  const updateOptionsIsLogined = () => {
    if (!UserData.isLogined) {
      profileBtn.classList.add('d-none');
      optionsWithLogin.forEach((element) => element.classList.add('d-none'));
    } else {
      optionsWithoutLogin.forEach((element) => element.classList.add('d-none'));
      // only one option - remove dropdown option
      if (optionsWithLogin.length <= 1) {
        actionContainer.dropdownBtn.remove();
        actionContainer.dropdownMenu.remove();
      }
    }
  };
  updateOptionsIsLogined();

  const buttonWrapper = Bootstrap.createElement('div', 'header__btnWrapper');
  buttonWrapper.append(cartBtn, profileBtn, actionContainer.btnGroup, burgerBtn);

  headerContainer.append(brand, collapseDiv, buttonWrapper);
  headerElement.append(headerContainer);
  return headerElement;
}

function clickDefaultActionBtn(chosenActionAction: UserAction) {
  if (chosenActionAction === UserAction.LogIn) {
    switchPage(Pages.LogIn);
  } else if (chosenActionAction === UserAction.SignUp) {
    switchPage(Pages.SignUp);
  } else if (chosenActionAction === UserAction.LogOut) {
    UserData.isLogined = false;
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
