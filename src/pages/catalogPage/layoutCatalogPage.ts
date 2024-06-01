import { InfoBook, InfoBookCategory, Pages } from '../../elements/types';
import requestsAPI from '../../elements/requestsAPI';
import * as variablesCatalogPage from '../catalogPage/variablesForCatalogPage';
import './styleCatalogPage.scss';
import switchPage from '../../elements/switchPage';
import { generateCards } from './layoutCardsProducts';
import { createNumberPage } from './createPaginationToCatalog';

const COUNT_CHUNKS = 10;
let COUNT_PAGES: number;
const FIRST_PAGE = 0;
let CACHED_BOOKS: [] = [];
let PAGES_CREATED = false;
const SORT_TYPES: { [key: string]: string } = {
  Alphabetically: 'Alphabetically',
  Cheap: 'Cheap',
  Expensive: 'Expensive',
  'No sort': 'No sort',
};

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
    variablesCatalogPage.listItemAllBooks,
    variablesCatalogPage.listItemClassic,
    variablesCatalogPage.listItemScience,
    variablesCatalogPage.listItemRomantic,
    variablesCatalogPage.listItemIT,
    variablesCatalogPage.listItemBestsellers,
    variablesCatalogPage.listItemPsychology,
  );

  variablesCatalogPage.listSort.append(
    variablesCatalogPage.listItemNoSort,
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

  if (variablesCatalogPage.containerForBreadcrumb.contains(variablesCatalogPage.nameCategory)) {
    variablesCatalogPage.newArrow.remove();
    variablesCatalogPage.nameCategory.remove();
  }

  CACHED_BOOKS = [];

  setTimeout(async () => {
    getBooks();
    attachCategoryAndSortListeners();
  }, 500);

  localStorage.setItem('category', 'false');
  localStorage.setItem('sort', 'false');

  variablesCatalogPage.iconArrowRight.onclick = null;
  variablesCatalogPage.iconArrowRight.onclick = swapCatalogPages.bind(null, 'right');

  variablesCatalogPage.iconArrowLeft.onclick = null;
  variablesCatalogPage.iconArrowLeft.onclick = swapCatalogPages.bind(null, 'left');

  variablesCatalogPage.iconForInputSearchBooks.addEventListener('click', () => {
    if (variablesCatalogPage.inputSearchBooks.value.length !== 0) {
      variablesCatalogPage.inputSearchBooks.value = '';
      searchBook();
    }
  });

  variablesCatalogPage.linkMain.addEventListener('click', () => {
    switchPage(Pages.Main);
  });

  variablesCatalogPage.linkCatalog.addEventListener('click', () => {
    switchPage(Pages.Catalog);
  });

  variablesCatalogPage.inputMinPrice.addEventListener('input', handlePriceInputChange);
  variablesCatalogPage.inputMaxPrice.addEventListener('input', handlePriceInputChange);

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
  });
}

function attachCategoryAndSortListeners() {
  document.querySelectorAll('.list-categories__item').forEach((category) => {
    category.addEventListener('click', async () => {
      document
        .querySelectorAll('.catalog-page__active-category')
        .forEach((item) => item.classList.remove('catalog-page__active-category'));
      document
        .querySelectorAll('.catalog-page__active-sort')
        .forEach((item) => item.classList.remove('catalog-page__active-sort'));
      if (category.textContent !== 'All books') {
        const resultBooks = await requestsAPI.getCategory(category.id);
        CACHED_BOOKS = resultBooks.results;
        localStorage.setItem('category', 'true');
        variablesCatalogPage.listItemAllBooks.classList.remove('d-none');
        variablesCatalogPage.listItemAllBooks.classList.add('d-flex');
        category.classList.add('catalog-page__active-category');
        if (!variablesCatalogPage.containerForBreadcrumb.contains(variablesCatalogPage.nameCategory)) {
          variablesCatalogPage.containerForBreadcrumb.append(
            variablesCatalogPage.newArrow,
            variablesCatalogPage.nameCategory,
          );
        }
      } else {
        const resultBooks = await requestsAPI.getProducts();
        CACHED_BOOKS = resultBooks.results;
        variablesCatalogPage.listItemAllBooks.classList.remove('d-flex');
        variablesCatalogPage.listItemAllBooks.classList.add('d-none');
        if (variablesCatalogPage.containerForBreadcrumb.contains(variablesCatalogPage.nameCategory)) {
          variablesCatalogPage.newArrow.remove();
          variablesCatalogPage.nameCategory.remove();
        }
        localStorage.setItem('category', 'false');
      }
      localStorage.setItem('numberPageBooks', '0');
      variablesCatalogPage.inputSearchBooks.value = '';
      variablesCatalogPage.inputMinPrice.value = '';
      variablesCatalogPage.inputMaxPrice.value = '';
      variablesCatalogPage.containerForPagination.classList.remove('d-none');
      variablesCatalogPage.containerForPagination.classList.add('d-flex');
      variablesCatalogPage.iconForInputSearchBooks.style.backgroundImage =
        "url('data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M21.0002%2021L16.6572%2016.657M16.6572%2016.657C17.4001%2015.9141%2017.9894%2015.0322%2018.3914%2014.0615C18.7935%2013.0909%2019.0004%2012.0506%2019.0004%2011C19.0004%209.94939%2018.7935%208.90908%2018.3914%207.93845C17.9894%206.96782%2017.4001%206.08588%2016.6572%205.34299C15.9143%204.6001%2015.0324%204.01081%2014.0618%203.60877C13.0911%203.20672%2012.0508%202.99979%2011.0002%202.99979C9.9496%202.99979%208.90929%203.20672%207.93866%203.60877C6.96803%204.01081%206.08609%204.6001%205.34321%205.34299C3.84288%206.84332%203%208.87821%203%2011C3%2013.1218%203.84288%2015.1567%205.34321%2016.657C6.84354%2018.1573%208.87842%2019.0002%2011.0002%2019.0002C13.122%2019.0002%2015.1569%2018.1573%2016.6572%2016.657Z%22%20stroke%3D%22%23ADB5BD%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')";
      PAGES_CREATED = false;
      variablesCatalogPage.nameCategory.textContent = category.textContent;
      variablesCatalogPage.nameCategory.id = category.id;
      variablesCatalogPage.buttonAllBooks.textContent = category.textContent;
      variablesCatalogPage.buttonSort.textContent = 'No sort';
      variablesCatalogPage.listItemNoSort.classList.remove('d-flex');
      variablesCatalogPage.listItemNoSort.classList.add('d-none');
      generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS));
    });
  });

  document.querySelectorAll('.list-sort__item').forEach((sort) => {
    sort.addEventListener('click', async () => {
      localStorage.setItem('sort', 'true');
      const sortType = SORT_TYPES[sort.textContent as string];
      document
        .querySelectorAll('.catalog-page__active-sort')
        .forEach((item) => item.classList.remove('catalog-page__active-sort'));

      if (sortType === 'No sort') {
        const resultBooks =
          localStorage.getItem('category') === 'true'
            ? await requestsAPI.getCategory(variablesCatalogPage.nameCategory.id)
            : await requestsAPI.getProducts();
        variablesCatalogPage.listItemNoSort.classList.remove('d-flex');
        variablesCatalogPage.listItemNoSort.classList.add('d-none');
        CACHED_BOOKS = resultBooks.results;
      } else {
        sort.classList.add('catalog-page__active-sort');
        variablesCatalogPage.listItemNoSort.classList.remove('d-none');
        variablesCatalogPage.listItemNoSort.classList.add('d-flex');
        await handleSort(sortType, !!variablesCatalogPage.nameCategory.id);
      }

      generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS));
      variablesCatalogPage.buttonSort.textContent = sort.textContent;
      variablesCatalogPage.inputSearchBooks.value = '';
      variablesCatalogPage.containerForPagination.classList.remove('d-none');
      variablesCatalogPage.containerForPagination.classList.add('d-flex');
      variablesCatalogPage.iconForInputSearchBooks.style.backgroundImage =
        "url('data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M21.0002%2021L16.6572%2016.657M16.6572%2016.657C17.4001%2015.9141%2017.9894%2015.0322%2018.3914%2014.0615C18.7935%2013.0909%2019.0004%2012.0506%2019.0004%2011C19.0004%209.94939%2018.7935%208.90908%2018.3914%207.93845C17.9894%206.96782%2017.4001%206.08588%2016.6572%205.34299C15.9143%204.6001%2015.0324%204.01081%2014.0618%203.60877C13.0911%203.20672%2012.0508%202.99979%2011.0002%202.99979C9.9496%202.99979%208.90929%203.20672%207.93866%203.60877C6.96803%204.01081%206.08609%204.6001%205.34321%205.34299C3.84288%206.84332%203%208.87821%203%2011C3%2013.1218%203.84288%2015.1567%205.34321%2016.657C6.84354%2018.1573%208.87842%2019.0002%2011.0002%2019.0002C13.122%2019.0002%2015.1569%2018.1573%2016.6572%2016.657Z%22%20stroke%3D%22%23ADB5BD%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')";
    });
  });
}

async function handleSort(sortType: string, isCategory: boolean) {
  const resultBooks = await requestsAPI.sortNameAndPriceWithCategory(
    variablesCatalogPage.nameCategory.id,
    sortType,
    isCategory,
  );
  CACHED_BOOKS = resultBooks.results;
  localStorage.setItem('numberPageBooks', '0');
  PAGES_CREATED = false;

  generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS));
}

export async function getBooks() {
  try {
    if (CACHED_BOOKS.length === 0) {
      const resultBooks = await requestsAPI.getProducts();
      getAllCategories();
      CACHED_BOOKS = resultBooks.results;
    }
    generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS));
    variablesCatalogPage.inputSearchBooks.addEventListener('input', searchBook);
  } catch (error) {
    console.error('Failed to get books:', error);
  }
}

async function searchBook() {
  const isCategoryTrue = localStorage.getItem('category') === 'true';

  if (variablesCatalogPage.inputSearchBooks.value.length !== 0) {
    variablesCatalogPage.iconForInputSearchBooks.style.backgroundImage =
      "url('data:image/svg+xml,%3Csvg%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.39989%2013.3079L0.691895%2012.5999L6.29189%206.99989L0.691895%201.39989L1.39989%200.691895L6.99989%206.29189L12.5999%200.691895L13.3079%201.39989L7.70789%206.99989L13.3079%2012.5999L12.5999%2013.3079L6.99989%207.70789L1.39989%2013.3079Z%22%20fill%3D%22%23ADB5BD%22%2F%3E%3C%2Fsvg%3E')";
  } else {
    variablesCatalogPage.iconForInputSearchBooks.style.backgroundImage =
      "url('data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M21.0002%2021L16.6572%2016.657M16.6572%2016.657C17.4001%2015.9141%2017.9894%2015.0322%2018.3914%2014.0615C18.7935%2013.0909%2019.0004%2012.0506%2019.0004%2011C19.0004%209.94939%2018.7935%208.90908%2018.3914%207.93845C17.9894%206.96782%2017.4001%206.08588%2016.6572%205.34299C15.9143%204.6001%2015.0324%204.01081%2014.0618%203.60877C13.0911%203.20672%2012.0508%202.99979%2011.0002%202.99979C9.9496%202.99979%208.90929%203.20672%207.93866%203.60877C6.96803%204.01081%206.08609%204.6001%205.34321%205.34299C3.84288%206.84332%203%208.87821%203%2011C3%2013.1218%203.84288%2015.1567%205.34321%2016.657C6.84354%2018.1573%208.87842%2019.0002%2011.0002%2019.0002C13.122%2019.0002%2015.1569%2018.1573%2016.6572%2016.657Z%22%20stroke%3D%22%23ADB5BD%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')";
  }

  const resultBooks = await requestsAPI.getBookWithSearch(
    variablesCatalogPage.inputSearchBooks.value,
    variablesCatalogPage.nameCategory.id,
    isCategoryTrue,
  );

  CACHED_BOOKS = resultBooks.results;
  PAGES_CREATED = false;
  generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS));

  if (resultBooks.results.length === 0) {
    variablesCatalogPage.containerForErrorSearch.append(
      variablesCatalogPage.imgForErrorSearch,
      variablesCatalogPage.containerForTextErrorSearch,
      variablesCatalogPage.containerForTextToTrySearch,
    );
    variablesCatalogPage.containerForTextErrorSearch.textContent = `
    Strange, but there is nothing for the request "${variablesCatalogPage.inputSearchBooks.value}"`;
    variablesCatalogPage.containerForAllBooks.append(variablesCatalogPage.containerForErrorSearch);
    variablesCatalogPage.containerForPagination.classList.remove('d-flex');
    variablesCatalogPage.containerForPagination.classList.add('d-none');
  } else {
    variablesCatalogPage.containerForPagination.classList.remove('d-none');
    variablesCatalogPage.containerForPagination.classList.add('d-flex');
  }

  setTimeout(() => {
    document.querySelectorAll('.catalog-page__cards-name').forEach((bookName) => {
      const regex = new RegExp(variablesCatalogPage.inputSearchBooks.value, 'gi');
      bookName.innerHTML = (bookName.textContent as string).replace(regex, (match) => {
        return `<span class='catalog-page__colored'>${match}</span>`;
      });
    });
  });
}

function generateBooks(array: InfoBook[][] | InfoBookCategory[][]) {
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
          let img = '';
          let noFilters;

          if (Object.prototype.hasOwnProperty.call(book, 'masterData')) {
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
          if (noFilters.masterVariant.images.length !== 0) {
            img = noFilters.masterVariant.images[0].url;
          }
          const priceInfo = noFilters.masterVariant.prices[0];
          const hasDiscount =
            priceInfo.discounted && priceInfo.discounted.value && priceInfo.discounted.value.centAmount;
          variablesCatalogPage.containerForAllBooks.append(
            generateCards(
              img,
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

function splitArrayIntoChunks<T>(array: T[], chunkSize: number) {
  const result: T[][] = [];
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

async function fetchProductsByPriceRange(minPrice: string, maxPrice: string) {
  try {
    const resultBooks =
      localStorage.getItem('category') === 'true'
        ? await requestsAPI.getBooksByPriceRange(minPrice, maxPrice, true, variablesCatalogPage.nameCategory.id)
        : await requestsAPI.getBooksByPriceRange(minPrice, maxPrice, false, variablesCatalogPage.nameCategory.id);
    CACHED_BOOKS = resultBooks.results;
    PAGES_CREATED = false;
    generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS));
  } catch (error) {
    console.error('Failed to fetch products by price range:', error);
  }
}

const handlePriceInputChange = async () => {
  const minPrice = String(Number(variablesCatalogPage.inputMinPrice.value) * 100);
  const maxPrice = String(Number(variablesCatalogPage.inputMaxPrice.value) * 100);
  if (minPrice !== '0' && maxPrice !== '0') {
    fetchProductsByPriceRange(minPrice, maxPrice);
  } else {
    const resultBooks =
      localStorage.getItem('category') === 'true'
        ? await requestsAPI.getCategory(variablesCatalogPage.nameCategory.id)
        : await requestsAPI.getProducts();

    PAGES_CREATED = false;
    CACHED_BOOKS = resultBooks.results;
    generateBooks(splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS));
  }
};
