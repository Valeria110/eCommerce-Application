import generateRegistrationPage from '../pages/registration-page/layoutRegistrationPage';
import error404Page from '../pages/error404Page';
import { loginPage } from '../pages/loginPage';
import mainPage from '../pages/mainPage';
import switchPage from './switchPage';
import { AppEvents, Pages } from './types';

export default class App {
  start(): void {
    // switchPage(Pages.Main); // TODO: return back
    switchPage(Pages.SignUp);
  }
}

document.addEventListener(AppEvents.switchPage, (event) => {
  const newPage = (event as CustomEvent).detail;
  document.body.innerHTML = '';
  document.body.className = '';
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
    default:
      document.body.append(error404Page());
      break;
  }
});
