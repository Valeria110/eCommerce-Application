import generateRegistrationPage from '../pages/registration-page/layoutRegistrationPage';
import { loginPage } from '../pages/loginPage';
import mainPage from '../pages/mainPage';
import { AppEvents, Pages } from './types';
import { changePageRoute, handleLocation } from './pageRouting/routing';
import aboutUS from '../pages/aboutUs';
import header from './header/header';
import error404Page from '../pages/error404Page';
import footer from './footer/footer';
import product from './product/product';
import { generateCatalogPage } from '../pages/catalogPage/layoutCatalogPage';
import { userProfilePage } from '../pages/userProfilePage/userProfilePage';

export default class App {
  start(): void {
    localStorage.setItem('version', '1');
    // handleLocation();  causes main to be called again
  }
}

document.addEventListener(AppEvents.switchPage, (event) => {
  const { page, productId } = (event as CustomEvent).detail;
  renderPage(page, productId);
  changePageRoute(page, productId);
});

function renderPage(newPage: Pages, productId: string | undefined) {
  document.body.innerHTML = '';
  document.body.className = '';
  resetStyleAfterBurger();

  const pagesWithHeader = [Pages.Main, Pages.Catalog, Pages.AboutUS, Pages.Error404, Pages.Product, Pages.UserProfile];
  const pagesWithFooter = [Pages.Main, Pages.Catalog, Pages.AboutUS, Pages.Product, Pages.UserProfile];

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
      document.body.append(generateCatalogPage());
      break;
    case Pages.AboutUS:
      document.body.append(aboutUS());
      break;
    case Pages.Product:
      document.body.append(product(productId ?? ''));
      break;
    case Pages.UserProfile:
      document.body.append(userProfilePage());
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
  document.body.style.overflow = 'auto';
  document.body.style.padding = '0';
  document.body.removeAttribute('data-bs-overflow');
  document.body.removeAttribute('data-bs-padding-right');
}

window.addEventListener('popstate', handleLocation);
window.addEventListener('DOMContentLoaded', handleLocation);
