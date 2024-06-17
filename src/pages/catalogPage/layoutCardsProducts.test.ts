import { generateCards, insertDotBeforeLastTwoChars, extractBookInfo } from './layoutCardsProducts';

jest.mock('../../elements/requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('generateCards function', () => {
  const fakeData = {
    imgUrl: 'url',
    nameBook: '1984',
    authorBook: 'Oscar Wilde',
    price: 13,
    description: 'some description',
    id: '123456',
    discounted: '',
  };

  it('should return an element with the main tag name', () => {
    const containerForCard = generateCards(
      fakeData.imgUrl,
      fakeData.nameBook,
      fakeData.authorBook,
      fakeData.price,
      fakeData.description,
      fakeData.id,
    );
    expect(containerForCard.tagName).toBe('DIV');
  });

  it('should not return null value', () => {
    expect(
      generateCards(
        fakeData.imgUrl,
        fakeData.nameBook,
        fakeData.authorBook,
        fakeData.price,
        fakeData.description,
        fakeData.id,
      ),
    ).not.toBeNull();
  });

  it('should not return null value', () => {
    const containerForCard = generateCards(
      fakeData.imgUrl,
      fakeData.nameBook,
      fakeData.authorBook,
      fakeData.price,
      fakeData.description,
      fakeData.id,
    );
    expect(containerForCard.classList.contains('catalog-page__cards-container')).toBeTruthy();
  });
});

describe('insertDotBeforeLastTwoChars function', () => {
  it('should return the string passed as an argument if its length is less than 2', () => {
    const str = 'a';
    expect(insertDotBeforeLastTwoChars(str)).toEqual(str);
  });

  it('should return the string with a dot before the last two chars', () => {
    const str = 'hello';
    expect(insertDotBeforeLastTwoChars(str)).toEqual('hel.lo$');
  });
});

describe('extractBookInfo function', () => {
  const mockArray = [
    [
      {
        masterVariant: {
          attributes: [{ name: 'string', value: 'string' }],
          images: [{ url: 'string' }],
          prices: [
            {
              value: { centAmount: 12 },
              discounted: { value: { centAmount: 12 } },
            },
          ],
        },
        name: {
          'en-US': 'string',
          ru: 'string',
        },
        id: 'string',
      },
    ],
    [
      {
        masterVariant: {
          attributes: [{ name: 'string', value: 'string' }],
          images: [{ url: 'string' }],
          prices: [
            {
              value: { centAmount: 12 },
              discounted: { value: { centAmount: 12 } },
            },
          ],
        },
        name: {
          'en-US': 'string',
          ru: 'string',
        },
        id: 'string',
      },
    ],
  ];
  const mockCountPages = 3;
  const mockContainer = document.createElement('div');

  it('should not return anything', () => {
    expect(extractBookInfo(mockArray, mockCountPages, mockContainer)).toBeUndefined();
  });
});
