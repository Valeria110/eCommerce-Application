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
export const listItemDiscounted = createElement('li', 'dropdown-item list-sort__item', 'Discounted');

export const containerForPriceAndCurrency = createElement('div', 'd-flex catalog-page__container-dropdown');
export const inputMinPrice = createElement('input', 'catalog-page__input-price catalog-page__input-price_from');
inputMinPrice.placeholder = 'from';
export const inputMaxPrice = createElement('input', 'catalog-page__input-price catalog-page__input-price_to');
inputMaxPrice.placeholder = 'to';
export const priceCurrency = createElement('div', 'd-flex align-items-center', '$');

export const containerForInputSearchBooks = createElement('div', 'd-flex position-relative align-items-center');
export const inputSearchBooks = createElement('input', 'catalog-page__input-search');
inputSearchBooks.placeholder = 'Search';
export const iconForInputSearchBooks = createElement('div', 'catalog-page__input-icon');

export const containerForAllBooks = createElement('div', 'd-flex catalog-page__body');

export const containerForPagination = createElement('div', 'd-flex catalog-page__pagination');
export const iconArrowLeft = createElement('div', 'catalog-page__pagination-arrow');
iconArrowLeft.innerHTML =
  '<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 7L9.5 12L14.5 17" stroke="black" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>';
export const containerForNumbersPages = createElement('div', 'd-flex catalog-page__pagination-container');
export const iconArrowRight = createElement('div', 'catalog-page__pagination-arrow');
iconArrowRight.innerHTML =
  '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1L6.5 6L1.5 11" stroke="black" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>';
