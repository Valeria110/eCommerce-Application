import Bootstrap from '../elements/bootstrap/Bootstrap';
import discount from '../elements/discount/discount';
import findYourBook from '../elements/findYourBook/findYourBook';
import footer from '../elements/footer/footer';
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
  const div = Bootstrap.createElement('div');
  div.append(header());
  div.append(containerForModalWindow, shadowButton);
  div.append(findYourBook());
  div.append(discount());
  div.append(footer());

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
  return div;
}
