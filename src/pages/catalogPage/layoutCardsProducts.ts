import createElement from '../../elements/bootstrap/createElement';
import switchPage from '../../elements/switchPage';
import { Pages } from '../../elements/types';

const MAX_LENGTH_BOOK_NAME = 35;
const MAX_LENGTH_BOOK_DESCRITION = 120;
const LENGTH_FOR_SLICE_BOOK_NAME = 23;

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

function insertDotBeforeLastTwoChars(str: string) {
  if (str.length < 2) {
    return str;
  }

  const beforeLastTwo = str.slice(0, -2);
  const lastTwo = str.slice(-2);

  return beforeLastTwo + '.' + lastTwo + '$';
}
