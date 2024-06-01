import createElement from '../../elements/bootstrap/createElement';
import { getBooks } from './layoutCatalogPage';
import { containerForNumbersPages } from './variablesForCatalogPage';

export function createNumberPage(countPages: number) {
  localStorage.setItem('numberPageBooks', '0');
  containerForNumbersPages.innerHTML = '';
  for (let i = 0; i < countPages; i += 1) {
    const numberPage = createElement('div', 'catalog-page__pagination_item', `${i + 1}`);
    numberPage.id = i.toString();
    numberPage.addEventListener('click', () => {
      localStorage.setItem('numberPageBooks', String(numberPage.id));
      document
        .querySelectorAll('.catalog-page__pagination_item.active-page')
        .forEach((item) => item.classList.remove('active-page'));

      const newPageElement = document.getElementById(String(numberPage.id));
      if (newPageElement) {
        newPageElement.classList.add('active-page');
      }
      getBooks();
    });

    if (numberPage.id === localStorage.getItem('numberPageBooks')) {
      numberPage.classList.add('active-page');
    }
    containerForNumbersPages.append(numberPage);
  }
}
