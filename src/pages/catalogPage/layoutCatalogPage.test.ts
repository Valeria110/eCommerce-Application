import { generateCards, insertDotBeforeLastTwoChars } from './layoutCardsProducts';

describe('generateCards function', () => {
  const imgUrl = 'testUrl';
  const nameBook = 'Test Book';
  const authorBook = 'Test Author';
  const price = 100;
  const description = 'Test Description';
  const id = '1';
  const discounted = '50';

  const card = generateCards(imgUrl, nameBook, authorBook, price, description, id, discounted);

  const checkAndExpect = (element: Element | null, callback: (element: Element) => void) => {
    if (element) {
      callback(element);
    } else {
      throw new Error('Element not found');
    }
  };

  // it('should create a card with the correct background image', () => {
  //   const cover = card.querySelector('.catalog-page__cards-cover');
  //   checkAndExpect(cover, (el) => expect(el.style.backgroundImage).toBe(`url(${imgUrl})`));
  // });

  it('should create a card with the correct book name', () => {
    const name = card.querySelector('.catalog-page__cards-name');
    checkAndExpect(name, (el) => expect(el.textContent).toBe(nameBook));
  });

  it('should create a card with the correct author name', () => {
    const author = card.querySelector('.catalog-page__cards-name_author');
    checkAndExpect(author, (el) => expect(el.textContent).toBe(authorBook));
  });

  it('should create a card with the correct price', () => {
    const priceElement = card.querySelector('.catalog-page__cards-price');
    checkAndExpect(priceElement, (el) => expect(el.textContent).toBe(insertDotBeforeLastTwoChars(discounted)));
  });

  it('should create a card with the correct discounted price', () => {
    const discountedPriceElement = card.querySelector('.catalog-page__cards-price_discounted');
    checkAndExpect(discountedPriceElement, (el) =>
      expect(el.textContent).toBe(insertDotBeforeLastTwoChars(price.toString())),
    );
  });

  it('should create a card with the correct description', () => {
    const descriptionElement = card.querySelector('.catalog-page__cards-container_hover');
    checkAndExpect(descriptionElement, (el) => expect(el.textContent).toBe(description));
  });
});

describe('insertDotBeforeLastTwoChars function', () => {
  it('should return the same string if the length is less than 2', () => {
    const str = '1';
    const result = insertDotBeforeLastTwoChars(str);
    expect(result).toBe(str);
  });

  it('should insert a dot before the last two characters', () => {
    const str = '1000';
    const result = insertDotBeforeLastTwoChars(str);
    expect(result).toBe('10.00$');
  });

  it('should work correctly with empty strings', () => {
    const str = '';
    const result = insertDotBeforeLastTwoChars(str);
    expect(result).toBe(str);
  });
});
