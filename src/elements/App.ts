import generateRegistrationPage from '../pages/registration-page/layoutRegistrationPage';
import { error404Page } from '../pages/error404Page';
import { loginPage } from '../pages/loginPage';
import mainPage from '../pages/mainPage';
import { AppEvents, Pages } from './types';
import { changePageRoute, handleLocation } from './pageRouting/routing';

export default class App {
  start(): void {
    localStorage.setItem('version', '1');
    // handleLocation();  causes main to be called again
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
      document.body.append(generateRegistrationPage());
      changePageRoute(Pages.SignUp);
      break;
    case Pages.Main:
      document.body.append(mainPage());
      changePageRoute(Pages.Main);
      break;
    default:
      error404Page().forEach((element) => {
        document.body.append(element);
      });
      changePageRoute(Pages.Error404);
      break;
  }
});

window.addEventListener('popstate', handleLocation);
window.addEventListener('DOMContentLoaded', handleLocation);
