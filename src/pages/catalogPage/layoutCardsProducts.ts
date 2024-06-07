import createElement from '../../elements/bootstrap/createElement';
import switchPage from '../../elements/switchPage';
import { InfoBook, InfoBookCategory, Pages } from '../../elements/types';
import * as variablesCatalogPage from '../catalogPage/variablesForCatalogPage';
import { toggleElementVisibility } from './catalogPageUtils';
import { handleSearchError } from './searchErrorHandler';

const MAX_LENGTH_BOOK_NAME = 35;
const MAX_LENGTH_BOOK_DESCRITION = 120;
const LENGTH_FOR_SLICE_BOOK_NAME = 23;
const FIRST_PAGE = 0;
const COUNT_CHUNKS = 10;

export function generateCards(
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
  const containerForBodyCard = createElement('div', '');
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

  const containerForButtonAddToCart = createElement('div', 'd-flex catalog-page__container-button-cart');
  const buttonAddToCart = createElement('div', 'catalog-page__button-cart', 'Add to cart');
  buttonAddToCart.id = id;

  if (containerForDiscountedPrice.textContent !== '') {
    containerForCover.append(cardDiscounted);
    priceBook.textContent = insertDotBeforeLastTwoChars(discounted);
    containerForDiscountedPrice.textContent = insertDotBeforeLastTwoChars(price.toString());
  }

  containerForCard.append(containerForBodyCard, containerForButtonAddToCart);
  containerForBodyCard.append(containerForBook, containerHover);
  containerForBook.append(containerForCover, containerForDescription);
  containerForNameAndAuthor.append(name, author);
  containerForPrice.append(priceBook, containerForDiscountedPrice);
  containerForDescription.append(containerForNameAndAuthor, containerForPrice);
  containerForButtonAddToCart.append(buttonAddToCart);

  containerForBodyCard.addEventListener('click', () => {
    switchPage(Pages.Product, id);
  });

  containerForButtonAddToCart.addEventListener('click', () => {
    console.log(123);
  });

  return containerForCard;
}

export function insertDotBeforeLastTwoChars(str: string) {
  if (str.length < 2) {
    return str;
  }

  const beforeLastTwo = str.slice(0, -2);
  const lastTwo = str.slice(-2);

  return beforeLastTwo + '.' + lastTwo + '$';
}

export function extractBookInfo(
  array: InfoBook[][] | InfoBookCategory[][],
  countPages: number,
  container: HTMLDivElement,
) {
  variablesCatalogPage.containerForAllBooks.innerHTML = '';

  if (array.length === 0) {
    handleSearchError();
    toggleElementVisibility(variablesCatalogPage.containerForPagination, false);
  } else {
    toggleElementVisibility(variablesCatalogPage.containerForPagination, true);
  }

  if (countPages === 1) {
    variablesCatalogPage.iconArrowLeft.disabled = true;
    variablesCatalogPage.iconArrowRight.disabled = true;
  } else if (localStorage.getItem('numberPageBooks') === FIRST_PAGE.toString()) {
    variablesCatalogPage.iconArrowLeft.disabled = true;
    variablesCatalogPage.iconArrowRight.disabled = false;
  } else if (localStorage.getItem('numberPageBooks') === (countPages - 1).toString()) {
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
          container.append(
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
