import Bootstrap from '../elements/bootstrap/Bootstrap';
import discount from '../elements/discount/discount';
import findYourBook from '../elements/findYourBook/findYourBook';
import switchPage from '../elements/switchPage';
import { Pages } from '../elements/types';
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
  div.append(containerForModalWindow, shadowButton);
  div.append(findYourBook());
  div.append(discount());
  div.append(goToProductBtn());

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

function goToProductBtn() {
  // TODO: Debug time
  const block = Bootstrap.createElement('div', 'd-flex flex-column justify-content-center align-items-center my-4');

  const btn = Bootstrap.createButton(
    "Go to product 'Mind power into the 21st century'",
    'btn-orange border-0 btn-style-default mx-1',
  );
  btn.addEventListener('click', () => {
    switchPage(Pages.Product, '54c754ea-1ddf-488e-b58f-21f4257ee50a');
  });
  block.append(btn);
  return block;
}
