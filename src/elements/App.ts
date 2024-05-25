import generateRegistrationPage from '../pages/registration-page/layoutRegistrationPage';
import { loginPage } from '../pages/loginPage';
import mainPage from '../pages/mainPage';
import { AppEvents, Pages } from './types';
import { changePageRoute, handleLocation } from './pageRouting/routing';
import catalog from '../pages/catalog';
import aboutUS from '../pages/aboutUs';
import header from './header/header';
import error404Page from '../pages/error404Page';
import footer from './footer/footer';
import product from './product/product';

export default class App {
  start(): void {
    localStorage.setItem('version', '1');
    handleLocation();
  }
}

document.addEventListener(AppEvents.switchPage, (event) => {
  const newPage = (event as CustomEvent).detail;
  renderPage(newPage);
  changePageRoute(newPage);
});

function renderPage(newPage: Pages) {
  document.body.innerHTML = '';
  document.body.className = '';
  resetStyleAfterBurger();

  const pagesWithHeader = [Pages.Main, Pages.Catalog, Pages.AboutUS, Pages.Error404, Pages.Product];
  const pagesWithFooter = [Pages.Main, Pages.Catalog, Pages.AboutUS, Pages.Product];

  if (pagesWithHeader.includes(newPage)) {
    document.body.append(header(newPage));
  }

  switch (newPage) {
    case Pages.LogIn:
      document.body.append(loginPage());
      break;
    case Pages.SignUp:
      document.body.append(generateRegistrationPage());
      break;
    case Pages.Main:
      document.body.append(mainPage());
      break;
    case Pages.Catalog:
      document.body.append(catalog());
      break;
    case Pages.AboutUS:
      document.body.append(aboutUS());
      break;
    case Pages.Product:
      document.body.append(product('54c754ea-1ddf-488e-b58f-21f4257ee50a'));
      break;
    default:
      document.body.append(error404Page());
      break;
  }

  if (pagesWithFooter.includes(newPage)) {
    document.body.append(footer());
  }
}

function resetStyleAfterBurger() {
  // TODO: simplefy it
  document.body.style.overflow = 'auto';
  document.body.style.padding = '0';
  document.body.removeAttribute('data-bs-overflow');
  document.body.removeAttribute('data-bs-padding-right');
}

window.addEventListener('popstate', handleLocation);
window.addEventListener('DOMContentLoaded', handleLocation);
