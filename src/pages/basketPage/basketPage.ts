import Bootstrap from '../../elements/bootstrap/Bootstrap';
import cart from '../../elements/cart';
import cartTempControlPanel from '../../elements/cartTempControlPanel';
import { ProductCart } from '../../elements/types';
import { convertCentsToDollars } from '../../libs/convertCentsToDollars';
import './basketPage.scss';

export default function basketPage() {
  const container = Bootstrap.createElement('div', '', 'Basket');

  const products = Bootstrap.createElement('div', 'basketProductList');

  const generateBtn = Bootstrap.createButton('generate', 'btn-orange border-0 m-1');
  generateBtn.addEventListener('click', () => {
    products.innerHTML = '';
    cart.products.forEach((product) => {
      products.append(createProductCard(product));
    });
  });

  container.append(cartTempControlPanel(), generateBtn, products);

  return container;
}

function createProductCard(product: ProductCart) {
  const container = Bootstrap.createElement('div', 'basketProduct');

  const leftColumn = Bootstrap.createElement('div', 'basketProduct__leftColumn');
  const imageElement = Bootstrap.createElement('img', 'basketProduct__image');
  imageElement.src = product.images[0];
  leftColumn.append(imageElement);

  const rightColumn = Bootstrap.createElement('div', 'basketProduct__rightColumn');
  rightColumn.append(Bootstrap.createElement('h2', 'basketProduct__title', product.title));
  rightColumn.append(Bootstrap.createElement('h3', 'basketProduct__author', product.author));
  rightColumn.append(
    Bootstrap.createElement('div', 'basketProduct__price', convertCentsToDollars(product.prices.regular)),
  );
  rightColumn.append(createQuantityInput(product, container));

  container.append(leftColumn, rightColumn);
  return container;
}

function createQuantityInput(product: ProductCart, card: HTMLDivElement): HTMLDivElement {
  const container = Bootstrap.createElement('div', 'basketProduct__quantityInput');

  const decrease = Bootstrap.createElement('div', 'basketProduct__quantityInputButton', '-');
  const value = Bootstrap.createElement('div', 'basketProduct__quantityInputNumber', String(product.quantity));
  const increase = Bootstrap.createElement('div', 'basketProduct__quantityInputButton', '+');

  const updateValue = () => {
    const updateCard = cart.products.find((item) => item.id === product.id);
    if (updateCard) {
      value.textContent = String(updateCard.quantity);
    } else {
      // decrease by 0
      card.classList.add('d-none');
    }
  };

  decrease.addEventListener('click', () => cart.decreaseProductQuantity(product.id).then(() => updateValue()));
  increase.addEventListener('click', () => cart.increaseProductQuantity(product.id).then(() => updateValue()));

  container.append(decrease, value, increase);

  return container;
}
