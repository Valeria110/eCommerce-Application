import requestsAPI from '../requestsAPI';
import switchPage from '../switchPage';
import { Pages } from '../types';

function changePageRoute(page: Pages, productId: string | undefined = undefined) {
  switch (page) {
    case Pages.LogIn:
      if (isUserLogined()) {
        history.pushState({ state: 'main_page' }, 'Main Page', '/main');
      } else {
        history.pushState({ state: 'login_page' }, 'Login Page', '/login');
      }
      break;
    case Pages.Main:
      history.pushState({ state: 'main_page' }, 'Main Page', '/main');
      break;
    case Pages.SignUp:
      if (isUserLogined()) {
        history.pushState({ state: 'main_page' }, 'Main Page', '/main');
      } else {
        history.pushState({ state: 'sign_up_page' }, 'Sign Up Page', '/sign_up');
      }
      break;
    case Pages.Error404:
      history.pushState({ state: 'error_404_page' }, 'Error 404 Page', '/error_404');
      break;
    case Pages.Product:
      history.pushState({ state: 'product' }, 'Product', `/product/${productId ?? ''}`);
      break;
    case Pages.Catalog:
      history.pushState({ state: 'catalog' }, 'Catalog', '/catalog');
      break;
    case Pages.AboutUS:
      history.pushState({ state: 'about us' }, 'About us', '/about_us');
      break;
    default:
      console.error('configure routing in changePageRoute()');
  }
}

const routes = ['/login', '/main', '/sign_up', '/catalog', '/about_us'];

function handleLocation() {
  const pathname = window.location.pathname;

  if (pathname === '/') {
    switchPage(Pages.Main);
  } else if (!routes.includes(pathname)) {
    switchPage(Pages.Error404);
  } else {
    switch (pathname) {
      case '/login':
        if (isUserLogined()) {
          switchPage(Pages.Main);
        } else {
          switchPage(Pages.LogIn);
        }
        break;
      case '/main':
        switchPage(Pages.Main);
        break;
      case '/catalog':
        switchPage(Pages.Catalog);
        break;
      case '/about_us':
        switchPage(Pages.AboutUS);
        break;
      case '/sign_up':
        if (isUserLogined()) {
          switchPage(Pages.Main);
        } else {
          switchPage(Pages.SignUp);
        }
        break;
    }
  }
}

function isUserLogined() {
  return requestsAPI.isLogined;
}

export { changePageRoute, handleLocation };
