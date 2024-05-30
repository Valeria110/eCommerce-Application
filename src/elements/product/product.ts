import Bootstrap from '../bootstrap/Bootstrap';
import createElement from '../bootstrap/createElement';
import requestsAPI from '../requestsAPI';
import switchPage from '../switchPage';
import { Pages, Product } from '../types';
import './product.scss';

export default function product(id: string) {
  console.log(`id product ${id}`); // TODO: del
  const page = Bootstrap.createElement('div', 'd-flex flex-column');

  (async () => {
    const response = await requestsAPI.getProductsByID(id);
    console.log('product response', response);
    if (response) {
      const cardProduct = Bootstrap.createElement('div', 'd-flex justify-content-center align-items-center');
      cardProduct.append(createLeftColumn(response));
      cardProduct.append(createRightColumn(response));

      page.append(createCatalogPath(response.title), cardProduct); // TODO: replace svg icon
    } else {
      switchPage(Pages.Error404);
    }
  })();

  return page;
}

function createRightColumn(response: Product) {
  const column = Bootstrap.createElement('div', 'd-flex flex-column justify-content-center w-50');

  column.append(Bootstrap.createElement('h2', 'product__titile', response.title));
  column.append(Bootstrap.createElement('h3', 'product__author', response.author));
  column.append(Bootstrap.createElement('p', 'product__description', response.description));

  const prices = Bootstrap.createElement('div', 'product__cards-price-container');
  if (response.prices.discounted) {
    prices.append(
      Bootstrap.createElement('div', 'product__cards-price_current', convertCentsToDollars(response.prices.discounted)),
    );
    prices.append(
      Bootstrap.createElement('div', 'product__cards-price_previous', convertCentsToDollars(response.prices.regular)),
    );
  } else {
    prices.append(
      Bootstrap.createElement('div', 'product__cards-price_current', convertCentsToDollars(response.prices.regular)),
    );
  }

  const buyBtn = Bootstrap.createButton('Buy', 'btn-orange border-0 btn-style-default w-50 mx-1');
  const addCartBtn = Bootstrap.createButton('Add to card', 'btn-white btn-style-default w-25 mx-1');
  const wrapperBtn = Bootstrap.createElement('div');
  wrapperBtn.append(buyBtn);
  wrapperBtn.append(addCartBtn);

  column.append(prices, wrapperBtn);
  return column;
}

function convertCentsToDollars(cents: number) {
  const dollars = cents / 100;
  return (dollars % 1 === 0 ? dollars.toFixed(0) : dollars.toFixed(2)) + '$';
}

function getProcentDiscount(response: Product) {
  if (!response.prices.discounted) {
    return '';
  }
  const discount = response.prices.discounted / response.prices.regular;
  return Math.round(discount * 100) + '%';
}

function createLeftColumn(response: Product) {
  const containerForCard = createElement('div', 'catalog-page__cards-container');
  const containerForBook = createElement('div', 'catalog-page__cards-body');
  const containerForCover = createElement('div', 'catalog-page__cards-cover');
  containerForCover.style.backgroundImage = `url(${response.images[0]})`;

  if (response.prices.discounted) {
    const cardDiscounted = createElement('div', 'catalog-page__cards-discounted', getProcentDiscount(response));
    containerForCover.append(cardDiscounted);
  }

  containerForCard.append(containerForBook);
  containerForBook.append(containerForCover);

  return containerForCard;
}

function createCatalogPath(title: string, folder = 'Catalog'): HTMLElement {
  const nav = Bootstrap.createElement('nav', 'breadcrumb catalogPath');
  nav.style.setProperty('--bs-breadcrumb-divider', '">"');
  nav.setAttribute('aria-label', 'breadcrumb');
  const ol = Bootstrap.createElement('ol', 'breadcrumb');
  const li1 = Bootstrap.createElement('li', 'breadcrumb-item');
  const a = Bootstrap.createElement('a', 'catalogPath__folder');
  a.href = '#';
  a.textContent = folder;
  a.addEventListener('click', (event) => {
    event.preventDefault();
    switchPage(Pages.Catalog);
  });
  li1.append(a);
  const li2 = Bootstrap.createElement('li', ['breadcrumb-item', 'active']);
  li2.setAttribute('aria-current', 'page');
  li2.textContent = title;
  ol.append(li1, li2);
  nav.append(ol);
  return nav;
}
