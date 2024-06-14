import requestsAPI from '../../elements/requestsAPI';
import * as variablesCatalogPage from '../catalogPage/variablesForCatalogPage';
import './styleCatalogPage.scss';
import { extractBookInfo } from './layoutCardsProducts';
import { createCatalogPagination } from './createPaginationToCatalog';
import { buildCatalogStructure, attachCatalogEventListeners } from './catalogStructure';
import { resetActiveClasses, toggleElementVisibility } from './catalogPageUtils';
import { handleSearchError } from './searchErrorHandler';
import Bootstrap from '../../elements/bootstrap/Bootstrap';
import { AppEvents } from '../../elements/types';

const COUNT_CHUNKS = 10;
let COUNT_PAGES: number;
let CACHED_BOOKS: [] = [];
let PAGES_CREATED = false;
const SORT_TYPES: { [key: string]: string } = {
  Alphabetically: 'Alphabetically',
  Cheap: 'Cheap',
  Expensive: 'Expensive',
  'No sort': 'No sort',
};

export function generateCatalogPage() {
  variablesCatalogPage.containerForCatalogPage.innerHTML = '';

  let eventTriggered = false;
  const eventListener = async () => {
    eventTriggered = true;
    await getBooks();
  };

  document.body.addEventListener(AppEvents.updateCart, eventListener);

  setTimeout(async () => {
    if (!eventTriggered) {
      await getBooks();
    }
    document.body.removeEventListener(AppEvents.updateCart, eventListener);
  }, 1000);

  CACHED_BOOKS = [];
  PAGES_CREATED = false;
  localStorage.setItem('category', 'false');
  localStorage.setItem('sort', 'false');
  resetCatalog();

  variablesCatalogPage.containerForCatalogPage.append(Bootstrap.createLoadingSpiner());

  return variablesCatalogPage.containerForCatalogPage;
}

export function resetCatalog() {
  setTimeout(() => {
    variablesCatalogPage.buttonAllBooks.textContent = 'All books';
    variablesCatalogPage.buttonSort.textContent = 'No sort';
    variablesCatalogPage.inputSearchBooks.value = '';
    variablesCatalogPage.inputMinPrice.value = '';
    variablesCatalogPage.inputMaxPrice.value = '';
    toggleElementVisibility(variablesCatalogPage.listItemAllBooks, false);
    toggleElementVisibility(variablesCatalogPage.listItemNoSort, false);
    toggleElementVisibility(variablesCatalogPage.clearInputMinPrice, false);
    toggleElementVisibility(variablesCatalogPage.clearInputMaxPrice, false);
    resetActiveClasses('.catalog-page__active-category');
    resetActiveClasses('.catalog-page__active-sort');
  });
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
    category.addEventListener('click', () => handleCategoryClick(category as HTMLLIElement));
  });

  document.querySelectorAll('.list-sort__item').forEach((sort) => {
    sort.addEventListener('click', () => handleSortClick(sort as HTMLLIElement));
  });
}

async function handleCategoryClick(category: HTMLLIElement) {
  resetActiveClasses('.catalog-page__active-category');
  resetActiveClasses('.catalog-page__active-sort');

  try {
    if (category.textContent !== 'All books') {
      const resultBooks = await requestsAPI.getCategory(category.id);
      CACHED_BOOKS = resultBooks.results;
      localStorage.setItem('category', 'true');
      toggleElementVisibility(variablesCatalogPage.listItemAllBooks, true);
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
      toggleElementVisibility(variablesCatalogPage.listItemAllBooks, false);

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
    variablesCatalogPage.iconForInputSearchBooks.style.backgroundImage =
      "url('data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M21.0002%2021L16.6572%2016.657M16.6572%2016.657C17.4001%2015.9141%2017.9894%2015.0322%2018.3914%2014.0615C18.7935%2013.0909%2019.0004%2012.0506%2019.0004%2011C19.0004%209.94939%2018.7935%208.90908%2018.3914%207.93845C17.9894%206.96782%2017.4001%206.08588%2016.6572%205.34299C15.9143%204.6001%2015.0324%204.01081%2014.0618%203.60877C13.0911%203.20672%2012.0508%202.99979%2011.0002%202.99979C9.9496%202.99979%208.90929%203.20672%207.93866%203.60877C6.96803%204.01081%206.08609%204.6001%205.34321%205.34299C3.84288%206.84332%203%208.87821%203%2011C3%2013.1218%203.84288%2015.1567%205.34321%2016.657C6.84354%2018.1573%208.87842%2019.0002%2011.0002%2019.0002C13.122%2019.0002%2015.1569%2018.1573%2016.6572%2016.657Z%22%20stroke%3D%22%23ADB5BD%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')";
    PAGES_CREATED = false;
    variablesCatalogPage.nameCategory.textContent = category.textContent;
    variablesCatalogPage.nameCategory.id = category.id;
    variablesCatalogPage.buttonAllBooks.textContent = category.textContent;
    variablesCatalogPage.buttonSort.textContent = 'No sort';
    toggleElementVisibility(variablesCatalogPage.listItemNoSort, false);
    toggleElementVisibility(variablesCatalogPage.clearInputMinPrice, false);
    toggleElementVisibility(variablesCatalogPage.clearInputMaxPrice, false);
    extractBookInfo(
      splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
      COUNT_PAGES,
      variablesCatalogPage.containerForAllBooks,
    );
  } catch (error) {
    console.error('Error handling category click:', error);
  }
}

async function handleSortClick(sort: HTMLLIElement) {
  localStorage.setItem('sort', 'true');
  const sortType = SORT_TYPES[sort.textContent as string];
  resetActiveClasses('.catalog-page__active-sort');

  try {
    if (sortType === 'No sort') {
      if (variablesCatalogPage.inputSearchBooks.value !== '') {
        searchBook();
      } else if (variablesCatalogPage.inputMinPrice.value !== '' || variablesCatalogPage.inputMaxPrice.value !== '') {
        const minPrice = String(Number(variablesCatalogPage.inputMinPrice.value) * 100);
        const maxPrice = String(Number(variablesCatalogPage.inputMaxPrice.value) * 100);
        fetchProductsByPriceRange(minPrice, maxPrice);
      } else {
        const resultBooks =
          localStorage.getItem('category') === 'true'
            ? await requestsAPI.getCategory(variablesCatalogPage.nameCategory.id)
            : await requestsAPI.getProducts();
        toggleElementVisibility(variablesCatalogPage.listItemNoSort, false);
        CACHED_BOOKS = resultBooks.results;
      }
      toggleElementVisibility(variablesCatalogPage.listItemNoSort, false);
    } else {
      sort.classList.add('catalog-page__active-sort');
      toggleElementVisibility(variablesCatalogPage.listItemNoSort, true);
      await handleSort(sortType, !!variablesCatalogPage.nameCategory.id);
    }

    extractBookInfo(
      splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
      COUNT_PAGES,
      variablesCatalogPage.containerForAllBooks,
    );
    variablesCatalogPage.buttonSort.textContent = sort.textContent;
  } catch (error) {
    console.error('Error handling sort click:', error);
  }
}

export async function resetSorting() {
  const resultBooks =
    localStorage.getItem('category') === 'true'
      ? await requestsAPI.getCategory(variablesCatalogPage.nameCategory.id)
      : await requestsAPI.getProducts();
  toggleElementVisibility(variablesCatalogPage.listItemNoSort, false);
  CACHED_BOOKS = resultBooks.results;
  PAGES_CREATED = false;
  extractBookInfo(
    splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
    COUNT_PAGES,
    variablesCatalogPage.containerForAllBooks,
  );
  variablesCatalogPage.inputSearchBooks.value = '';
  variablesCatalogPage.inputMaxPrice.value = '';
  variablesCatalogPage.inputMinPrice.value = '';
  variablesCatalogPage.buttonSort.textContent = 'No sort';
  resetActiveClasses('.catalog-page__active-sort');
  toggleElementVisibility(variablesCatalogPage.clearInputMinPrice, false);
  toggleElementVisibility(variablesCatalogPage.clearInputMaxPrice, false);
  variablesCatalogPage.iconForInputSearchBooks.style.backgroundImage =
    "url('data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M21.0002%2021L16.6572%2016.657M16.6572%2016.657C17.4001%2015.9141%2017.9894%2015.0322%2018.3914%2014.0615C18.7935%2013.0909%2019.0004%2012.0506%2019.0004%2011C19.0004%209.94939%2018.7935%208.90908%2018.3914%207.93845C17.9894%206.96782%2017.4001%206.08588%2016.6572%205.34299C15.9143%204.6001%2015.0324%204.01081%2014.0618%203.60877C13.0911%203.20672%2012.0508%202.99979%2011.0002%202.99979C9.9496%202.99979%208.90929%203.20672%207.93866%203.60877C6.96803%204.01081%206.08609%204.6001%205.34321%205.34299C3.84288%206.84332%203%208.87821%203%2011C3%2013.1218%203.84288%2015.1567%205.34321%2016.657C6.84354%2018.1573%208.87842%2019.0002%2011.0002%2019.0002C13.122%2019.0002%2015.1569%2018.1573%2016.6572%2016.657Z%22%20stroke%3D%22%23ADB5BD%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')";
}

async function handleSort(sortType: string, isCategory: boolean) {
  let minPrice;
  let maxPrice;
  if (variablesCatalogPage.inputMinPrice.value === '' || variablesCatalogPage.inputMaxPrice.value === '') {
    minPrice = '';
    maxPrice = '';
  } else {
    minPrice = String(Number(variablesCatalogPage.inputMinPrice.value) * 100);
    maxPrice = String(Number(variablesCatalogPage.inputMaxPrice.value) * 100);
  }
  try {
    const resultBooks = await requestsAPI.sortNameAndPriceWithCategory(
      variablesCatalogPage.nameCategory.id,
      sortType,
      isCategory,
      minPrice,
      maxPrice,
      variablesCatalogPage.inputSearchBooks.value,
    );

    CACHED_BOOKS = resultBooks.results;
    localStorage.setItem('numberPageBooks', '0');
    PAGES_CREATED = false;
    extractBookInfo(
      splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
      COUNT_PAGES,
      variablesCatalogPage.containerForAllBooks,
    );
  } catch (error) {
    console.error('Error handling sort click:', error);
  }
}

export async function getBooks() {
  try {
    if (CACHED_BOOKS.length === 0) {
      const resultBooks = await requestsAPI.getProducts();
      getAllCategories();
      CACHED_BOOKS = resultBooks.results;
      if (resultBooks) {
        buildCatalogStructure();
        attachCatalogEventListeners();
        attachCategoryAndSortListeners();
      }
    }
    document.querySelector('.loadingSpiner')?.remove();
    toggleElementVisibility(variablesCatalogPage.containerForPagination, true);
    extractBookInfo(
      splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
      COUNT_PAGES,
      variablesCatalogPage.containerForAllBooks,
    );
    variablesCatalogPage.inputSearchBooks.addEventListener('input', searchBook);
  } catch (error) {
    console.error('Failed to get books:', error);
  }
}

export async function searchBook() {
  const isCategoryTrue = localStorage.getItem('category') === 'true';

  if (variablesCatalogPage.inputSearchBooks.value.length !== 0) {
    variablesCatalogPage.iconForInputSearchBooks.style.backgroundImage =
      "url('data:image/svg+xml,%3Csvg%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.39989%2013.3079L0.691895%2012.5999L6.29189%206.99989L0.691895%201.39989L1.39989%200.691895L6.99989%206.29189L12.5999%200.691895L13.3079%201.39989L7.70789%206.99989L13.3079%2012.5999L12.5999%2013.3079L6.99989%207.70789L1.39989%2013.3079Z%22%20fill%3D%22%23ADB5BD%22%2F%3E%3C%2Fsvg%3E')";
  } else {
    variablesCatalogPage.iconForInputSearchBooks.style.backgroundImage =
      "url('data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M21.0002%2021L16.6572%2016.657M16.6572%2016.657C17.4001%2015.9141%2017.9894%2015.0322%2018.3914%2014.0615C18.7935%2013.0909%2019.0004%2012.0506%2019.0004%2011C19.0004%209.94939%2018.7935%208.90908%2018.3914%207.93845C17.9894%206.96782%2017.4001%206.08588%2016.6572%205.34299C15.9143%204.6001%2015.0324%204.01081%2014.0618%203.60877C13.0911%203.20672%2012.0508%202.99979%2011.0002%202.99979C9.9496%202.99979%208.90929%203.20672%207.93866%203.60877C6.96803%204.01081%206.08609%204.6001%205.34321%205.34299C3.84288%206.84332%203%208.87821%203%2011C3%2013.1218%203.84288%2015.1567%205.34321%2016.657C6.84354%2018.1573%208.87842%2019.0002%2011.0002%2019.0002C13.122%2019.0002%2015.1569%2018.1573%2016.6572%2016.657Z%22%20stroke%3D%22%23ADB5BD%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')";
  }

  let minPrice;
  let maxPrice;
  if (variablesCatalogPage.inputMinPrice.value === '' || variablesCatalogPage.inputMaxPrice.value === '') {
    minPrice = '';
    maxPrice = '';
  } else {
    minPrice = String(Number(variablesCatalogPage.inputMinPrice.value) * 100);
    maxPrice = String(Number(variablesCatalogPage.inputMaxPrice.value) * 100);
  }

  const resultBooks = await requestsAPI.getBookWithSearch(
    variablesCatalogPage.inputSearchBooks.value,
    variablesCatalogPage.nameCategory.id,
    isCategoryTrue,
    minPrice,
    maxPrice,
  );

  CACHED_BOOKS = resultBooks.results;
  PAGES_CREATED = false;
  toggleElementVisibility(variablesCatalogPage.listItemNoSort, false);
  resetActiveClasses('.catalog-page__active-sort');
  variablesCatalogPage.buttonSort.textContent = 'No sort';
  extractBookInfo(
    splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
    COUNT_PAGES,
    variablesCatalogPage.containerForAllBooks,
  );

  setTimeout(() => {
    document.querySelectorAll('.catalog-page__cards-name').forEach((bookName) => {
      const regex = new RegExp(variablesCatalogPage.inputSearchBooks.value, 'gi');
      bookName.innerHTML = (bookName.textContent as string).replace(regex, (match) => {
        return `<span class='catalog-page__colored'>${match}</span>`;
      });
    });
  });
}

export function splitArrayIntoChunks<T>(array: T[], chunkSize: number, isCatalog: boolean) {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  COUNT_PAGES = result.length;
  if (!PAGES_CREATED && isCatalog !== false) {
    createCatalogPagination(COUNT_PAGES);
    PAGES_CREATED = true;
  }
  return result;
}

async function fetchProductsByPriceRange(minPrice: string, maxPrice: string) {
  try {
    if (
      variablesCatalogPage.inputMaxPrice.value.length === 0 &&
      variablesCatalogPage.inputMinPrice.value.length === 0 &&
      variablesCatalogPage.inputSearchBooks.value.length === 0
    ) {
      const resultBooks2 =
        localStorage.getItem('category') === 'true'
          ? await requestsAPI.getCategory(variablesCatalogPage.nameCategory.id)
          : await requestsAPI.getProducts();

      PAGES_CREATED = false;
      CACHED_BOOKS = resultBooks2.results;
      extractBookInfo(
        splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
        COUNT_PAGES,
        variablesCatalogPage.containerForAllBooks,
      );
    } else if (
      variablesCatalogPage.inputMaxPrice.value.length === 0 &&
      variablesCatalogPage.inputMinPrice.value.length === 0 &&
      variablesCatalogPage.inputSearchBooks.value.length !== 0
    ) {
      searchBook();
    } else {
      const resultBooks =
        localStorage.getItem('category') === 'true'
          ? await requestsAPI.getBooksByPriceRange(
              minPrice,
              maxPrice,
              true,
              variablesCatalogPage.nameCategory.id,
              variablesCatalogPage.inputSearchBooks.value,
            )
          : await requestsAPI.getBooksByPriceRange(
              minPrice,
              maxPrice,
              false,
              variablesCatalogPage.nameCategory.id,
              variablesCatalogPage.inputSearchBooks.value,
            );

      CACHED_BOOKS = resultBooks.results;
      PAGES_CREATED = false;
      extractBookInfo(
        splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
        COUNT_PAGES,
        variablesCatalogPage.containerForAllBooks,
      );
    }
  } catch (error) {
    CACHED_BOOKS = [];
    PAGES_CREATED = false;
    toggleElementVisibility(variablesCatalogPage.containerForPagination, false);
    extractBookInfo(
      splitArrayIntoChunks(CACHED_BOOKS, COUNT_CHUNKS, true),
      COUNT_PAGES,
      variablesCatalogPage.containerForAllBooks,
    );
    handleSearchError();
  }
}

export const handlePriceInputChange = async () => {
  const minPrice = String(Number(variablesCatalogPage.inputMinPrice.value) * 100);
  const maxPrice = String(Number(variablesCatalogPage.inputMaxPrice.value) * 100);
  toggleElementVisibility(variablesCatalogPage.listItemNoSort, false);
  resetActiveClasses('.catalog-page__active-sort');
  variablesCatalogPage.buttonSort.textContent = 'No sort';

  if (variablesCatalogPage.inputMinPrice.value.length !== 0) {
    toggleElementVisibility(variablesCatalogPage.clearInputMinPrice, true);
  } else {
    toggleElementVisibility(variablesCatalogPage.clearInputMinPrice, false);
  }

  if (variablesCatalogPage.inputMaxPrice.value.length !== 0) {
    toggleElementVisibility(variablesCatalogPage.clearInputMaxPrice, true);
  } else {
    toggleElementVisibility(variablesCatalogPage.clearInputMaxPrice, false);
  }

  fetchProductsByPriceRange(minPrice, maxPrice);
};
