import Bootstrap from '../bootstrap/Bootstrap';
import cartSrc from './../../img/cart.svg';
import profileSrc from './../../img/profile-light.svg';
import burgerSrc from './../../img/burger-menu.svg';
import './header.scss';
import switchPage from '../switchPage';
import { AppEvents, Pages } from '../types';
import requestsAPI from '../requestsAPI';
import logoSrc from './../../img/lithub-logo.svg';
import userPhotoSrc from './../../img/placeholderUser.png';
import editIconSrc from './../../img/edit-icon.svg';
import exitIconSrc from './../../img/exit-icon.svg';
import cart from '../cart';
import { isNull } from '../../utils/utils';

enum UserAction {
  LogIn = 'Log in',
  SignUp = 'Sign up',
  LogOut = 'Log out',
}

let defaultAction = requestsAPI.isLogined ? UserAction.LogOut : UserAction.LogIn;

document.body.addEventListener(AppEvents.updateCounterCart, () => {
  const cartBtnBadge = document.querySelector('.header__cart-btn-badge');
  isNull<HTMLSpanElement>(cartBtnBadge);
  const itemsInCart = cart.counter;
  console.log(itemsInCart);

  if (itemsInCart) {
    cartBtnBadge.textContent = `${cart.counter}+`;
  }
});

export default function header(currentPage: Pages): HTMLElement {
  defaultAction = requestsAPI.isLogined ? UserAction.LogOut : UserAction.LogIn;
  const headerElement = Bootstrap.createElement('nav', 'header navbar');
  const headerContainer = Bootstrap.createElement('div', 'container-fluid px-0');

  const brand = Bootstrap.createElement('a', 'navbar-brand header__brand', 'LitHub');
  brand.addEventListener('click', () => switchPage(Pages.Main));
  const logo = Bootstrap.createElement('img', 'd-inline-block align-top');
  logo.src = logoSrc as string;
  brand.prepend(logo);

  const menuLinks = createLinksMenu(currentPage, 'header__linkCollapse');

  const cartBtn = createButtonImg(cartSrc as string, 'header__btnImg me-1');
  const cartBadge = Bootstrap.createElement('span', 'header__cart-btn-badge badge rounded-pill bg-secondary');
  const itemsInCart = cart.counter;
  if (itemsInCart) {
    cartBadge.textContent = `${cart.counter}+`;
  }
  cartBtn.appendChild(cartBadge);
  const profileBtn = createButtonImg(profileSrc as string, 'header__btnImg');
  profileBtn.addEventListener('click', () => {
    switchPage(Pages.UserProfile);
  });
  if (!requestsAPI.isLogined) {
    profileBtn.classList.add('d-none');
  }

  const actionContainer = createActionContainer();

  const burgerOffCanvasID = 'burgerOffCanvas';
  const burgerBtn = createButtonImg(burgerSrc as string, 'header__burger p-0');
  burgerBtn.dataset.bsToggle = 'offcanvas';
  burgerBtn.dataset.bsTarget = `#${burgerOffCanvasID}`;
  burgerBtn.setAttribute('aria-controls', 'burger right side panel');

  const rightPanel = createRightPanel(currentPage);
  const offCanvasRightPanel = Bootstrap.createOffCanvas(burgerOffCanvasID, '', rightPanel);

  const buttonWrapper = Bootstrap.createElement('div', 'header__btnWrapper');
  buttonWrapper.append(profileBtn, cartBtn, actionContainer.btnGroup, burgerBtn);

  headerContainer.append(brand, menuLinks, buttonWrapper, offCanvasRightPanel);
  headerElement.append(headerContainer);
  return headerElement;
}

function createRightPanel(currentPage: Pages) {
  const logoutBtn = Bootstrap.createButton('Log out', 'btn-orange border-0 btn-style-default w-50 mx-1');
  const userCard = createUserCard();
  const rightPanel = Bootstrap.createElement('div', 'rightPanel p-3');
  const exitImg = Bootstrap.createElement('img', 'ms-2');
  exitImg.src = exitIconSrc as string;
  logoutBtn.append(exitImg);

  const loginBtn = Bootstrap.createButton('Log in', 'btn-orange border-0 btn-style-default w-50 mx-1');
  const signUpBtn = Bootstrap.createButton('Sign up', 'btn-gray border-0 btn-style-default w-50 mx-1');

  if (requestsAPI.isLogined) {
    loginBtn.classList.add('d-none');
    signUpBtn.classList.add('d-none');
  } else {
    userCard.classList.add('d-none');
    logoutBtn.classList.add('d-none');
  }

  [loginBtn, signUpBtn, logoutBtn].forEach((element) => {
    element.addEventListener('click', () => {
      const convertAction = textToUserAction(element.textContent ?? '');
      if (convertAction) {
        defaultAction = convertAction;
        clickDefaultActionBtn(defaultAction);
      }
    });
  });

  const btnWrapper = Bootstrap.createElement('div', 'd-flex');
  if (requestsAPI.isLogined) {
    btnWrapper.classList.add('justify-content-start');
  } else {
    btnWrapper.classList.add('justify-content-evenly');
  }
  btnWrapper.append(logoutBtn, loginBtn, signUpBtn);

  const menuLinks = createLinksMenu(currentPage, '', 'my-2');

  rightPanel.append(userCard, menuLinks, btnWrapper);
  return rightPanel;
}

function createActionContainer() {
  const optionsWithoutLogin = [UserAction.LogIn, UserAction.SignUp].map((text) =>
    Bootstrap.createNavItem(text, 'dropdown-item', false, false, 'dropdown-item-style-default'),
  );
  const optionsWithLogin = [UserAction.LogOut].map((text) =>
    Bootstrap.createNavItem(text, 'dropdown-item', false, false, 'dropdown-item-style-default'),
  );

  const actionContainer = Bootstrap.createDropdownSplitButton(defaultAction, 'btn-orange border-0', 'dropdown-orange');
  actionContainer.btnGroup.classList.add('header__actionBtn');
  actionContainer.mainBtn.classList.add('btn-style-default');
  actionContainer.dropdownMenu.append(...optionsWithoutLogin, ...optionsWithLogin);

  if (!requestsAPI.isLogined) {
    optionsWithLogin.forEach((element) => element.classList.add('d-none'));
  } else {
    optionsWithoutLogin.forEach((element) => element.classList.add('d-none'));
    if (optionsWithLogin.length <= 1) {
      // if only one option - remove dropdown option
      actionContainer.dropdownBtn.remove();
      actionContainer.dropdownMenu.remove();
    }
  }

  [...optionsWithoutLogin, ...optionsWithLogin].forEach((element) => {
    element.addEventListener('click', () => {
      const convertAction = textToUserAction(element.textContent ?? '');
      if (convertAction) {
        defaultAction = convertAction;
        actionContainer.mainBtn.textContent = convertAction;

        clickDefaultActionBtn(defaultAction);
      }
    });
  });
  actionContainer.mainBtn.addEventListener('click', () => {
    clickDefaultActionBtn(defaultAction);
  });
  return actionContainer;
}

function createLinksMenu(currentPage: Pages, className = '', classNameLi = 'mx-1') {
  const pages = [Pages.Main, Pages.Catalog, Pages.AboutUS];

  const collapseDiv = Bootstrap.createElement('div', className);
  const ul = Bootstrap.createElement('ul', 'navbar-nav');

  pages.forEach((page) => {
    ul.append(Bootstrap.createNavItem(page, 'nav-item', currentPage === page, false, classNameLi, page));
  });

  collapseDiv.append(ul);
  return collapseDiv;
}

function createButtonImg(imgSrc: string, classNameBtn = '') {
  const btn = Bootstrap.createButton('', 'border-0 ' + classNameBtn);
  const img = Bootstrap.createElement('img', 'd-inline-block');
  img.src = imgSrc;
  btn.prepend(img);
  return btn;
}

function clickDefaultActionBtn(chosenActionAction: UserAction) {
  localStorage.setItem('version', '1');
  if (chosenActionAction === UserAction.LogIn) {
    switchPage(Pages.LogIn);
  } else if (chosenActionAction === UserAction.SignUp) {
    switchPage(Pages.SignUp);
  } else if (chosenActionAction === UserAction.LogOut) {
    requestsAPI.authCustomersLogout();
    switchPage(Pages.Main);
  } else {
    console.error('problem with default button');
  }
}
function createUserCard() {
  const div = Bootstrap.createElement('div', 'userCard');

  const img = Bootstrap.createElement('img', 'rounded-circle userCard__img');
  img.alt = 'Logo';
  img.src = userPhotoSrc as string;

  const divRight = Bootstrap.createElement('div');
  const userName = Bootstrap.createElement(
    'p',
    'userCard__fullName my-1',
    `${requestsAPI.customerData.firstName} ${requestsAPI.customerData.lastName}`,
  );
  document.body.addEventListener(AppEvents.updateUserName, () => {
    userName.textContent = `${requestsAPI.customerData.firstName} ${requestsAPI.customerData.lastName}`;
  });
  const email = Bootstrap.createElement('p', 'userCard__contactInfo my-1', requestsAPI.customerData.email);

  const editLink = Bootstrap.createElement('a', 'icon-link text-decoration-none a-orange-300 mt-1 disabled', 'edit');
  editLink.href = '#';
  editLink.addEventListener('click', (event) => {
    event.preventDefault();
  });
  const editIcon = Bootstrap.createElement('img');
  editIcon.src = editIconSrc as string;
  editLink.prepend(editIcon);

  divRight.append(userName, email, editLink);

  div.append(img, divRight);
  return div;
}

function textToUserAction(str: string): UserAction | undefined {
  if ((Object.values(UserAction) as string[]).includes(str)) {
    return str as unknown as UserAction;
  } else {
    console.error('problem with textToUserAction');
    return undefined;
  }
}
