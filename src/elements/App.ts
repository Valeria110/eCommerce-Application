import error404Page from '../pages/error404Page';
import { loginPage } from '../pages/loginPage';
import mainPage from '../pages/mainPage';
import signUpPage from '../pages/signUpPage';
import switchPage from './switchPage';
import { AppEvents, Pages } from './types';
import { changePageRoute, handleLocation } from './pageRouting/routing';

export default class App {
  start(): void {
    switchPage(Pages.Main);
    changePageRoute(Pages.Main);
  }
}

document.addEventListener(AppEvents.switchPage, (event) => {
  const newPage = (event as CustomEvent).detail;
  document.body.innerHTML = '';
  document.body.className = '';
  switch (newPage) {
    case Pages.LogIn:
      document.body.append(loginPage());
      changePageRoute(Pages.LogIn);
      break;
    case Pages.SignUp:
      document.body.append(signUpPage());
      changePageRoute(Pages.SignUp);
      break;
    case Pages.Main:
      document.body.append(mainPage());
      changePageRoute(Pages.Main);
      break;
    default:
      document.body.append(error404Page());
      changePageRoute(Pages.Error404);
      break;
  }
});

window.addEventListener('popstate', () => {
  handleLocation();
});

window.addEventListener('DOMContentLoaded', handleLocation);
