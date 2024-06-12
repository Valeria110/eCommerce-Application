import Bootstrap from '../bootstrap/Bootstrap';
import redBookSrc from './../../img/redBook-discount.png';
import './discount.scss';

export default function discount() {
  const container = Bootstrap.createElement('div', 'discount');

  const bookImg = Bootstrap.createElement('img', 'discount__img');
  bookImg.src = redBookSrc as string;

  const paragraph = Bootstrap.createElement('p', 'discount__text');

  const text1 = document.createTextNode('Get a 5% discount on any book');
  const text2 = document.createTextNode('with a promo code ');

  const textPromoCode = Bootstrap.createElement('span', 'discount__text-promoCode', 'Lithub2024');

  paragraph.append(text1, document.createElement('br'), text2, textPromoCode);

  container.append(bookImg, paragraph);
  return container;
}
