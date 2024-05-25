import Bootstrap from '../bootstrap/Bootstrap';
import switchPage from '../switchPage';
import { Pages } from '../types';
import bookSrc from './../../img/bookCoffee.png';
import './findYourBook.scss';

export default function findYourBook() {
  const containerTop = Bootstrap.createElement('div', 'findYourBook');

  const bookImg = Bootstrap.createElement('img', 'findYourBook__img');
  bookImg.src = bookSrc as string;

  const divText = Bootstrap.createElement('div', 'findYourBook__leftColumn');

  const textWrapper = Bootstrap.createElement('div');
  const text1 = Bootstrap.createElement('p', 'findYourBook__text findYourBook__text-orange', 'Find your');
  const text2 = Bootstrap.createElement('p', 'findYourBook__text', 'favourite book now');

  const motto = Bootstrap.createElement(
    'p',
    'findYourBook__motto',
    'start now the path to your development and enrichment of knowledge',
  );
  textWrapper.append(text1, text2, motto);

  const btnCatalog = Bootstrap.createButton('Catalog', 'btn-orange border-0 btn-style-default findYourBook__btn');
  btnCatalog.addEventListener('click', () => switchPage(Pages.Catalog));

  divText.append(textWrapper, btnCatalog);
  containerTop.append(divText, bookImg);

  const containerBottom = Bootstrap.createElement('div', 'findYourBookBottom');
  const text3 = createSmallOrangeBlackText('1000+', 'bestsellers'); // TODO: fetch real after catalogs API
  const text4 = createSmallOrangeBlackText('10%', 'off on the first book');
  containerBottom.append(text3, text4);

  const container = Bootstrap.createElement('div');
  container.append(containerTop, containerBottom);
  return container;
}

function createSmallOrangeBlackText(orangeText: string, blackText: string) {
  const text3Number = Bootstrap.createElement(
    'span',
    'findYourBookBottom__textSmall findYourBookBottom__textSmall-orange',
    orangeText,
  );
  const text3Text = Bootstrap.createElement('span', 'findYourBookBottom__textSmall', ` ${blackText}`);
  const text3 = Bootstrap.createElement('p');
  text3.append(text3Number, text3Text);
  return text3;
}
