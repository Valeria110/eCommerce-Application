import createElement from '../../elements/bootstrap/createElement';
import { InfoBook } from '../../elements/interfaces';
import requestsAPI from '../../elements/requestsAPI';
import * as variablesCatalogPage from '../catalog-page/variablesForCatalogPage';
import './styleCatalogPage.scss';

const COUNT_CHUNKS = 10;
const COUNT_PAGES = 5;

export function generateCatalogPage() {
  localStorage.setItem('numberPageBooks', '0');

  variablesCatalogPage.containerForCatalogPage.append(
    variablesCatalogPage.containerForBooksFilterPanel,
    variablesCatalogPage.containerForAllBooks,
    variablesCatalogPage.containerForPagination,
  );
  variablesCatalogPage.containerForBooksFilterPanel.append(
    variablesCatalogPage.containerForCategoryAndPrice,
    variablesCatalogPage.containerForInputSearchBooks,
  );

  variablesCatalogPage.containerForCategoryAndPrice.append(
    variablesCatalogPage.containerforCategoryAndSort,
    variablesCatalogPage.containerForPriceAndCurrency,
  );

  variablesCatalogPage.containerforCategoryAndSort.append(
    variablesCatalogPage.dropDownBooksCategories,
    variablesCatalogPage.listCategories,
    variablesCatalogPage.dropDownBooksSort,
    variablesCatalogPage.listSort,
  );

  variablesCatalogPage.containerForPriceAndCurrency.append(
    variablesCatalogPage.inputMinPrice,
    variablesCatalogPage.inputMaxPrice,
    variablesCatalogPage.priceCurrency,
  );

  variablesCatalogPage.dropDownBooksCategories.append(variablesCatalogPage.buttonAllBooks);

  variablesCatalogPage.dropDownBooksSort.append(variablesCatalogPage.buttonSort);

  variablesCatalogPage.listCategories.append(
    variablesCatalogPage.listItemClassic,
    variablesCatalogPage.listItemScience,
    variablesCatalogPage.listItemRomantic,
    variablesCatalogPage.listItemIT,
    variablesCatalogPage.listItemBestsellers,
    variablesCatalogPage.listItemPsychology,
  );

  variablesCatalogPage.listSort.append(
    variablesCatalogPage.listItemCheap,
    variablesCatalogPage.listItemExpensive,
    variablesCatalogPage.listItemDiscounted,
  );

  variablesCatalogPage.containerForInputSearchBooks.append(
    variablesCatalogPage.inputSearchBooks,
    variablesCatalogPage.iconForInputSearchBooks,
  );

  variablesCatalogPage.containerForPagination.append(
    variablesCatalogPage.iconArrowLeft,
    variablesCatalogPage.containerForNumbersPages,
    variablesCatalogPage.iconArrowRight,
  );

  variablesCatalogPage.iconArrowRight.addEventListener('click', () => {
    localStorage.setItem('numberPageBooks', String(Number(localStorage.getItem('numberPageBooks') as string) + 0.5));
    getBooks();
  });

  variablesCatalogPage.iconArrowLeft.addEventListener('click', () => {
    localStorage.setItem('numberPageBooks', String(Number(localStorage.getItem('numberPageBooks') as string) - 0.5));
    getBooks();
  });

  createNumberPage(COUNT_PAGES);
  return variablesCatalogPage.containerForCatalogPage;
}

export async function getAllCategories() {
  const resultCategories = await requestsAPI.getCategories();
  document.querySelectorAll('.list-categories__item').forEach((item) => {
    resultCategories.results.forEach((categories: { name: string; id: string }) => {
      if (Object.values(categories.name).includes(item.textContent as string)) {
        item.id = categories.id;
      }
    });
  });
}

export async function getBooks() {
  getAllCategories();
  const resultBooks = await requestsAPI.getProducts();
  variablesCatalogPage.containerForAllBooks.innerHTML = '';
  splitArrayIntoChunks(resultBooks.results, COUNT_CHUNKS).forEach((arrayWithBooks, indexArray) => {
    if (indexArray === Number(localStorage.getItem('numberPageBooks'))) {
      arrayWithBooks.forEach((book: InfoBook, indexBook) => {
        if (indexBook < COUNT_CHUNKS) {
          book.masterData.staged.masterVariant.attributes.forEach((itemAttributes, indexitemAttribute) => {
            if (itemAttributes.name === 'author') {
              const priceInfo = book.masterData.staged.masterVariant.prices[0];
              const hasDiscount =
                priceInfo.discounted && priceInfo.discounted.value && priceInfo.discounted.value.centAmount;
              variablesCatalogPage.containerForAllBooks.append(
                generateCards(
                  book.masterData.staged.masterVariant.images[0].url,
                  book.masterData.staged.name['en-US'],
                  book.masterData.staged.masterVariant.attributes[indexitemAttribute].value,
                  book.masterData.staged.masterVariant.prices[0].value.centAmount,
                  hasDiscount ? priceInfo.discounted.value.centAmount.toString() : '',
                ),
              );
            }
          });
        }
      });
    }
  });
}

export function splitArrayIntoChunks(array: [], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

export function insertDotBeforeLastTwoChars(str: string) {
  if (str.length < 2) {
    return str;
  }

  const beforeLastTwo = str.slice(0, -2);
  const lastTwo = str.slice(-2);

  return beforeLastTwo + '.' + lastTwo + '$';
}

export function generateCards(imgUrl: string, nameBook: string, authorBook: string, price: number, discounted = '') {
  let shortNameBook = '';
  if (nameBook.length > 35) {
    shortNameBook = nameBook.slice(0, 24) + '...';
  } else {
    shortNameBook = nameBook;
  }

  const containerForBook = createElement('div', 'catalog-page__cards-body');
  const containerForCover = createElement('div', 'catalog-page__cards-cover');
  containerForCover.style.backgroundImage = `url(${imgUrl})`;
  const containerForDescription = createElement('div', 'catalog-page__cards-description');
  const containerForNameAndAuthor = createElement('div', 'catalog-page__cards-info');
  const name = createElement('div', 'catalog-page__cards-name', shortNameBook);
  const author = createElement('div', 'catalog-page__cards-name_author', authorBook);

  const containerForPrice = createElement('div', 'catalog-page__cards-price-container');
  const priceBook = createElement('div', 'catalog-page__cards-price', insertDotBeforeLastTwoChars(price.toString()));
  const containerForDiscountedPrice = createElement(
    'div',
    'catalog-page__cards-price_discounted',
    insertDotBeforeLastTwoChars(discounted),
  );
  const cardDiscounted = createElement('div', 'catalog-page__cards-discounted', '50%');

  if (containerForDiscountedPrice.textContent !== '') {
    containerForCover.append(cardDiscounted);
    priceBook.textContent = insertDotBeforeLastTwoChars(discounted);
    containerForDiscountedPrice.textContent = insertDotBeforeLastTwoChars(price.toString());
  }

  containerForBook.append(containerForCover, containerForDescription);
  containerForNameAndAuthor.append(name, author);
  containerForPrice.append(priceBook, containerForDiscountedPrice);
  containerForDescription.append(containerForNameAndAuthor, containerForPrice);
  return containerForBook;
}

export function createNumberPage(countPages: number) {
  variablesCatalogPage.containerForNumbersPages.innerHTML = '';
  for (let i = 0; i < countPages; i += 1) {
    const numberPage = createElement('div', 'catalog-page__pagination_item', `${i + 1}`);
    numberPage.id = i.toString();
    variablesCatalogPage.containerForNumbersPages.append(numberPage);
    if (i === 0) {
      numberPage.classList.add('activePage');
    }
  }
}
