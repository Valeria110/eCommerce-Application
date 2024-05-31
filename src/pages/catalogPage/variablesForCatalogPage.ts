import createElement from '../../elements/bootstrap/createElement';
import './styleCatalogPage.scss';

export const containerForCatalogPage = createElement('div', 'catalog-page__container');

export const containerForBooksFilterPanel = createElement('div', 'd-flex catalog-page__header');

export const containerForCategoryAndPrice = createElement('div', 'd-flex catalog-page__header-container');

export const containerforCategoryAndSort = createElement('div', 'd-flex catalog-page__container-dropdown');
export const dropDownBooksCategories = createElement(
  'div',
  'd-flex align-items-center catalog-page__dropdown dropdown-toggle',
);
dropDownBooksCategories.setAttribute('data-bs-toggle', 'dropdown');
dropDownBooksCategories.setAttribute('aria-expanded', 'false');
export const buttonAllBooks = createElement('div', '', 'All books');
export const listCategories = createElement('ul', 'dropdown-menu list-categories');
export const listItemClassic = createElement('li', 'dropdown-item list-categories__item', 'Classic');
export const listItemScience = createElement('li', 'dropdown-item list-categories__item', 'Science');
export const listItemRomantic = createElement('li', 'dropdown-item list-categories__item', 'Romantic');
export const listItemIT = createElement('li', 'dropdown-item list-categories__item', 'IT');
export const listItemBestsellers = createElement('li', 'dropdown-item list-categories__item', 'Bestsellers');
export const listItemPsychology = createElement('li', 'dropdown-item list-categories__item', 'Psychology');

export const dropDownBooksSort = createElement(
  'div',
  'd-flex align-items-center catalog-page__dropdown dropdown-toggle',
);
dropDownBooksSort.setAttribute('data-bs-toggle', 'dropdown');
dropDownBooksSort.setAttribute('aria-expanded', 'false');
export const buttonSort = createElement('div', '', 'No sort');
export const listSort = createElement('ul', 'dropdown-menu list-sort');
export const listItemCheap = createElement('li', 'dropdown-item list-sort__item', 'Cheap');
export const listItemExpensive = createElement('li', 'dropdown-item list-sort__item', 'Expensive');
export const listItemAlphabetically = createElement('li', 'dropdown-item list-sort__item', 'Alphabetically');

export const containerForPriceAndCurrency = createElement('div', 'd-flex catalog-page__container-dropdown');
export const inputMinPrice = createElement('input', 'catalog-page__input-price catalog-page__input-price_from');
inputMinPrice.placeholder = 'from';
export const inputMaxPrice = createElement('input', 'catalog-page__input-price catalog-page__input-price_to');
inputMaxPrice.placeholder = 'to';
export const priceCurrency = createElement('div', 'd-flex align-items-center', '$');

export const containerForInputSearchBooks = createElement('div', 'd-flex position-relative align-items-center');
export const inputSearchBooks = createElement('input', 'catalog-page__input-search');
inputSearchBooks.placeholder = 'Search';
inputSearchBooks.style.height = '36px';
export const iconForInputSearchBooks = createElement('div', 'catalog-page__input-icon');

export const containerForAllBooks = createElement('div', 'd-flex catalog-page__body');

export const containerForPagination = createElement('div', 'd-flex catalog-page__pagination');
export const iconArrowLeft = createElement('button', 'catalog-page__pagination-arrow');
iconArrowLeft.innerHTML =
  '<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 7L9.5 12L14.5 17" stroke="black" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>';
export const containerForNumbersPages = createElement('div', 'd-flex catalog-page__pagination-container');
export const iconArrowRight = createElement('button', 'catalog-page__pagination-arrow');
iconArrowRight.innerHTML =
  '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1L6.5 6L1.5 11" stroke="black" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>';

export const containerForBreadcrumb = createElement('div', 'catalog-page__breadcrumb');
export const linkMain = createElement('a', '', 'Main');
export const arrowToBreadcrumb = createElement('div', 'catalog-page__breadcrumb-arrow');
export const linkCatalog = createElement('a', '', 'Catalog');
export const newArrow = createElement('div', 'catalog-page__breadcrumb-arrow');
export const nameCategory = createElement('div', '', '');

export const containerForErrorSearch = createElement('div', 'catalog-page__search-container_error');
export const imgForErrorSearch = createElement('div', '');
imgForErrorSearch.innerHTML =
  '<svg class = "catalog-page__search-img_error" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.0002 21L16.6572 16.657M16.6572 16.657C17.4001 15.9141 17.9894 15.0322 18.3914 14.0615C18.7935 13.0909 19.0004 12.0506 19.0004 11C19.0004 9.94939 18.7935 8.90908 18.3914 7.93845C17.9894 6.96782 17.4001 6.08588 16.6572 5.34299C15.9143 4.6001 15.0324 4.01081 14.0618 3.60877C13.0911 3.20672 12.0508 2.99979 11.0002 2.99979C9.9496 2.99979 8.90929 3.20672 7.93866 3.60877C6.96803 4.01081 6.08609 4.6001 5.34321 5.34299C3.84288 6.84332 3 8.87821 3 11C3 13.1218 3.84288 15.1567 5.34321 16.657C6.84354 18.1573 8.87842 19.0002 11.0002 19.0002C13.122 19.0002 15.1569 18.1573 16.6572 16.657Z" stroke="#FD7E14" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export const containerForTextErrorSearch = createElement('div', 'catalog-page__search-text_error');
export const containerForTextToTrySearch = createElement(
  'div',
  'catalog-page__search-text_try',
  'Try changing your search criteria',
);
