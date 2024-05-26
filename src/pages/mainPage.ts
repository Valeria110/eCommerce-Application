import Bootstrap from '../elements/bootstrap/Bootstrap';
import header from '../elements/header/header';
import {
  bodyModalWindow,
  buttonCloseModalWindow,
  containerForModalWindow,
  contentModalWindow,
  headerModalWindow,
  modalWindow,
  shadowButton,
  titleModalWindow,
} from './registration-page/variablesForRegistrationPage';

export default function mainPage() {
  const bodyMain = Bootstrap.createElement('div');
  bodyMain.append(header());
  bodyMain.append(containerForModalWindow, shadowButton);
  containerForModalWindow.append(modalWindow);
  modalWindow.append(contentModalWindow);
  contentModalWindow.append(headerModalWindow, bodyModalWindow);
  headerModalWindow.append(titleModalWindow, buttonCloseModalWindow);
  if (localStorage.getItem('registerTrue') === 'true') {
    setTimeout(() => {
      shadowButton.click();
      localStorage.setItem('registerTrue', '');
    }, 100);
  }

  return bodyMain;
}
