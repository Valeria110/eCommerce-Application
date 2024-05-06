// import demoPage from '../pages/demoPage';
import error404Page from '../pages/error404Page';
import loginPage from '../pages/loginPage';
import mainPage from '../pages/mainPage';
import signUpPage from '../pages/signUpPage';
import { AppEvents, Pages } from './types';

export default class App {
  start(): void {
    document.body.append(mainPage());
  }
}

document.addEventListener(AppEvents.switchPage, (event) => {
  const newPage = (event as CustomEvent).detail;
  document.body.innerHTML = '';
  switch (newPage) {
    case Pages.LogIn:
      document.body.append(loginPage());
      break;
    case Pages.SignUp:
      document.body.append(signUpPage());
      break;
    case Pages.Main:
      document.body.append(mainPage());
      break;
    default:
      document.body.append(error404Page());
      break;
  }
});
