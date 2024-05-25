import Bootstrap from '../elements/bootstrap/Bootstrap';
import header from '../elements/header/header';
import { generateCatalogPage, getBooks } from './catalog-page/layoutCatalogPage';
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

  const get = setTimeout(() => {
    getBooks();
    clearTimeout(get);
  }, 300);

  div.append(generateCatalogPage());
  return div;
}
