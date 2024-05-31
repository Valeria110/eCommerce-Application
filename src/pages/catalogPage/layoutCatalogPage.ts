import createElement from '../../elements/bootstrap/createElement';
import { InfoBook, InfoBookCategory, Pages } from '../../elements/types';
import requestsAPI from '../../elements/requestsAPI';
import * as variablesCatalogPage from '../catalogPage/variablesForCatalogPage';
import './styleCatalogPage.scss';
import switchPage from '../../elements/switchPage';

const COUNT_CHUNKS = 10;
let COUNT_PAGES: number;
const FIRST_PAGE = 0;
let CACHED_BOOKS: [];
let PAGES_CREATED = false;
const MAX_LENGTH_BOOK_NAME = 35;
const MAX_LENGTH_BOOK_DESCRITION = 120;
const LENGTH_FOR_SLICE_BOOK_NAME = 23;

export function generateCatalogPage() {
  variablesCatalogPage.containerForCatalogPage.append(
    variablesCatalogPage.containerForBreadcrumb,
    variablesCatalogPage.containerForBooksFilterPanel,
    variablesCatalogPage.containerForAllBooks,
    variablesCatalogPage.containerForPagination,
  );

  variablesCatalogPage.containerForBreadcrumb.append(
    variablesCatalogPage.linkMain,
    variablesCatalogPage.arrowToBreadcrumb,
    variablesCatalogPage.linkCatalog,
  );

  variablesCatalogPage.linkMain.addEventListener('click', () => {
    switchPage(Pages.Main);
  });

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
    variablesCatalogPage.listItemAlphabetically,
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

  variablesCatalogPage.iconArrowRight.onclick = null;
  variablesCatalogPage.iconArrowRight.onclick = swapCatalogPages.bind(null, 'right');

  variablesCatalogPage.iconArrowLeft.onclick = null;
  variablesCatalogPage.iconArrowLeft.onclick = swapCatalogPages.bind(null, 'left');

  setTimeout(async () => {
    getBooks();
  }, 500);

  localStorage.setItem('category', 'false');
  return variablesCatalogPage.containerForCatalogPage;
}

function swapCatalogPages(direction: string) {
  const currentPageString = localStorage.getItem('numberPageBooks');
  const currentPage = currentPageString !== null ? Number(currentPageString) : 0;
  let newPage;

  if (direction === 'right') {
    newPage = currentPage + 1;
  } else {
    newPage = currentPage - 1;
  }

  localStorage.setItem('numberPageBooks', String(newPage));

  document
    .querySelectorAll('.catalog-page__pagination_item.active-page')
    .forEach((item) => item.classList.remove('active-page'));

  const newPageElement = document.getElementById(String(newPage));
  if (newPageElement) {
    newPageElement.classList.add('active-page');
  }

  getBooks();
}

export async function getAllCategories() {
  const resultCategories = await requestsAPI.getCategories();
  document.querySelectorAll('.list-categories__item').forEach((category) => {
    resultCategories.results.forEach((categories: { name: string; id: string }) => {
      if (Object.values(categories.name).includes(category.textContent as string)) {
        category.id = categories.id;
      }
    });

    category.addEventListener('click', async () => {
      const resultBooks = await requestsAPI.getCategory(category.id);
      CACHED_BOOKS = resultBooks.results;
      localStorage.setItem('numberPageBooks', '0');
      localStorage.setItem('category', 'true');
      PAGES_CREATED = false;
      if (!variablesCatalogPage.containerForBreadcrumb.contains(variablesCatalogPage.nameCategory)) {
        variablesCatalogPage.containerForBreadcrumb.append(
          variablesCatalogPage.newArrow,
          variablesCatalogPage.nameCategory,
        );
      }
      variablesCatalogPage.nameCategory.textContent = category.textContent;
      variablesCatalogPage.nameCategory.id = category.id;
      variablesCatalogPage.buttonAllBooks.textContent = category.textContent;
      generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS), true);
    });
  });

  document.querySelectorAll('.list-sort__item').forEach((sort) => {
    sort.addEventListener('click', async () => {
      if (sort.textContent === 'Alphabetically' && variablesCatalogPage.nameCategory.id) {
        const resultBooks = await requestsAPI.sortNameAndPriceWithCategory(
          variablesCatalogPage.nameCategory.id,
          'Alphabetically',
        );
        CACHED_BOOKS = resultBooks.results;
        localStorage.setItem('numberPageBooks', '0');
        PAGES_CREATED = false;
        generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS), true);
      } else if (sort.textContent === 'Cheap' && variablesCatalogPage.nameCategory.id) {
        const resultBooks = await requestsAPI.sortNameAndPriceWithCategory(
          variablesCatalogPage.nameCategory.id,
          'Cheap',
        );
        CACHED_BOOKS = resultBooks.results;
        localStorage.setItem('numberPageBooks', '0');
        PAGES_CREATED = false;
        generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS), true);
      } else if (sort.textContent === 'Expensive' && variablesCatalogPage.nameCategory.id) {
        const resultBooks = await requestsAPI.sortNameAndPriceWithCategory(
          variablesCatalogPage.nameCategory.id,
          'Expensive',
        );
        CACHED_BOOKS = resultBooks.results;
        localStorage.setItem('numberPageBooks', '0');
        PAGES_CREATED = false;
        generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS), true);
      }
      variablesCatalogPage.buttonSort.textContent = sort.textContent;
    });
  });
}

export async function getBooks() {
  if (!CACHED_BOOKS) {
    const resultBooks = await requestsAPI.getProducts();
    getAllCategories();
    CACHED_BOOKS = resultBooks.results;
  }
  if (localStorage.getItem('category') === 'true') {
    generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS), true);
  } else {
    generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS));
  }

  // search
}

function generateBooks(array: InfoBook[][], category = false) {
  variablesCatalogPage.containerForAllBooks.innerHTML = '';

  if (COUNT_PAGES === 1) {
    variablesCatalogPage.iconArrowLeft.disabled = true;
    variablesCatalogPage.iconArrowRight.disabled = true;
  } else if (localStorage.getItem('numberPageBooks') === FIRST_PAGE.toString()) {
    variablesCatalogPage.iconArrowLeft.disabled = true;
    variablesCatalogPage.iconArrowRight.disabled = false;
  } else if (localStorage.getItem('numberPageBooks') === (COUNT_PAGES - 1).toString()) {
    variablesCatalogPage.iconArrowRight.disabled = true;
    variablesCatalogPage.iconArrowLeft.disabled = false;
  } else {
    variablesCatalogPage.iconArrowLeft.disabled = false;
    variablesCatalogPage.iconArrowRight.disabled = false;
  }

  array.forEach((arrayWithBooks, indexArray: number) => {
    if (indexArray === Number(localStorage.getItem('numberPageBooks'))) {
      arrayWithBooks.forEach((book: InfoBook | InfoBookCategory, indexBook: number) => {
        if (indexBook < COUNT_CHUNKS) {
          let author: string = '';
          let description: string = '';
          let noFilters;
          if (category === false) {
            noFilters = (book as InfoBook).masterData.staged;
          } else {
            noFilters = book as InfoBookCategory;
          }
          noFilters.masterVariant.attributes.forEach((itemAttributes, indexitemAttribute: number) => {
            if (itemAttributes.name === 'author') {
              author = noFilters.masterVariant.attributes[indexitemAttribute].value;
            }
            if (itemAttributes.name === 'description') {
              description = noFilters.masterVariant.attributes[indexitemAttribute].value;
            }
          });
          const priceInfo = noFilters.masterVariant.prices[0];
          const hasDiscount =
            priceInfo.discounted && priceInfo.discounted.value && priceInfo.discounted.value.centAmount;
          variablesCatalogPage.containerForAllBooks.append(
            generateCards(
              noFilters.masterVariant.images[0].url,
              noFilters.name['en-US'],
              author,
              noFilters.masterVariant.prices[0].value.centAmount,
              description,
              book.id,
              hasDiscount ? priceInfo.discounted.value.centAmount.toString() : '',
            ),
          );
        }
      });
    }
  });
}

function splitArrayIntoChunks(array: [], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  COUNT_PAGES = result.length;
  if (!PAGES_CREATED) {
    createNumberPage(COUNT_PAGES);
    PAGES_CREATED = true;
  }
  return result;
}

function insertDotBeforeLastTwoChars(str: string) {
  if (str.length < 2) {
    return str;
  }

  const beforeLastTwo = str.slice(0, -2);
  const lastTwo = str.slice(-2);

  return beforeLastTwo + '.' + lastTwo + '$';
}

function generateCards(
  imgUrl: string,
  nameBook: string,
  authorBook: string,
  price: number,
  description: string,
  id: string,
  discounted = '',
) {
  let shortNameBook = '';
  if (nameBook.length > MAX_LENGTH_BOOK_NAME) {
    shortNameBook = nameBook.slice(0, LENGTH_FOR_SLICE_BOOK_NAME).trim() + '..';
  } else {
    shortNameBook = nameBook;
  }

  let shortDescription = '';
  if (description.length > MAX_LENGTH_BOOK_DESCRITION) {
    shortDescription = description.slice(0, MAX_LENGTH_BOOK_DESCRITION - 1).trim() + '..';
  } else {
    shortDescription = description;
  }

  const containerForCard = createElement('div', 'catalog-page__cards-container');
  const containerHover = createElement('div', 'catalog-page__cards-container_hover', shortDescription);
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

  containerForCard.append(containerForBook, containerHover);
  containerForBook.append(containerForCover, containerForDescription);
  containerForNameAndAuthor.append(name, author);
  containerForPrice.append(priceBook, containerForDiscountedPrice);
  containerForDescription.append(containerForNameAndAuthor, containerForPrice);
  containerForCard.addEventListener('click', () => {
    switchPage(Pages.Product, id);
  });
  return containerForCard;
}

function createNumberPage(countPages: number) {
  localStorage.setItem('numberPageBooks', '0');
  variablesCatalogPage.containerForNumbersPages.innerHTML = '';
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
    variablesCatalogPage.containerForNumbersPages.append(numberPage);
  }
}
