import Bootstrap from '../bootstrap/Bootstrap';
import requestsAPI from '../requestsAPI';
import switchPage from '../switchPage';
import { Pages, Product } from '../types';
import './product.scss';

export default function product(id: string) {
  console.log(`id product ${id}`); // TODO: del
  const page = Bootstrap.createElement('div', 'd-flex justify-content-center align-items-center');

  (async () => {
    const response = await requestsAPI.getProductsByID(id);
    console.log('product response', response);
    if (response) {
      page.append(createLeftColumn(response));
      page.append(createRightColumn(response));
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

  column.append(prices);
  return column;
}

function convertCentsToDollars(cents: number) {
  const dollars = cents / 100;
  return (dollars % 1 === 0 ? dollars.toFixed(0) : dollars.toFixed(2)) + '$';
}

function createLeftColumn(response: Product) {
  console.log(response);
  const column = Bootstrap.createElement('div', 'd-flex flex-column justify-content-center align-items-center w-50');
  column.append(Bootstrap.createElement('div', undefined, 'Place for img'));
  return column;
}
