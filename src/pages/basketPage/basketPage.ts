import Bootstrap from '../../elements/bootstrap/Bootstrap';
import cart from '../../elements/cart';
import cartTempControlPanel from '../../elements/cartTempControlPanel';
import { ProductCart } from '../../elements/types';
import { convertCentsToDollars } from '../../libs/convertCentsToDollars';
import './basketPage.scss';

export default function basketPage() {
  const container = Bootstrap.createElement('div', 'basketPage', 'Basket');

  const products = Bootstrap.createElement('div', 'basketProductList');

  const generateBtn = Bootstrap.createButton('generate', 'btn-orange border-0 m-1');
  generateBtn.addEventListener('click', () => {
    products.innerHTML = '';
    cart.products.forEach((product) => {
      products.append(createProductCard(product));
    });
  });

  const productSummary = Bootstrap.createElement('div', 'd-flex justify-content-between');
  productSummary.append(products, createSummary());

  container.append(cartTempControlPanel(), generateBtn, productSummary);

  return container;
}

function createSummary() {
  const container = Bootstrap.createElement('div', 'basketSummary');

  const title = Bootstrap.createElement('h2', 'basketSummary__title', 'Summary');

  const titlePromo = Bootstrap.createElement('h4', 'basketSummary__titlePromo', 'Promocode');

  const promoGroup = Bootstrap.createElement('div', 'input-group mb-3');
  const promoGroupId = 'basketPromoInput';

  const promoInput = Bootstrap.createElement('input', 'form-control');
  promoInput.setAttribute('type', 'text');
  promoInput.setAttribute('placeholder', 'Promocode');
  promoInput.setAttribute('aria-label', 'Promocode');
  promoInput.setAttribute('aria-describedby', promoGroupId);

  const promoButton = Bootstrap.createElement('button', 'btn btn-orange basketSummary__apply', 'Apply');
  promoButton.setAttribute('type', 'button');
  promoButton.setAttribute('id', promoGroupId);

  promoGroup.append(promoInput, promoButton);

  const checkOutBtn = Bootstrap.createButton('Check out', 'btn-orange border-0 basketSummary__btnCheckOut');

  const createPriceLine = (
    text: string,
    price: string,
    style: 'basketSummary__boldLine' | 'basketSummary__grayLine',
  ) => {
    const line1 = Bootstrap.createElement('div', 'd-flex justify-content-between');
    line1.classList.add(style);
    const text1 = Bootstrap.createElement('span', '', text);
    const price1 = Bootstrap.createElement('span', '', price);
    line1.append(text1, price1);
    return line1;
  };

  const line1 = createPriceLine('The amount without discount', '52$', 'basketSummary__grayLine');
  const line2 = createPriceLine('Discount', '0$', 'basketSummary__grayLine');
  const line3 = createPriceLine('Promocode', '5$', 'basketSummary__grayLine');
  const line4 = createPriceLine('Total', '47$', 'basketSummary__boldLine');
  const lines = Bootstrap.createElement('div', 'basketSummary__linesWrapper');
  lines.append(line1, line2, line3, line4);

  container.append(title, titlePromo, promoGroup, lines, checkOutBtn);
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

  const cardButtons = Bootstrap.createElement('div', 'basketProduct__cardButtons');

  const removeLink = Bootstrap.createElement('a', 'basketProduct__removeLink', 'remove');
  removeLink.addEventListener('click', (event) => {
    event.preventDefault();
    cart.removeProduct(product.id).then(() => container.classList.add('d-none'));
  });
  cardButtons.append(createQuantityInput(product, container), removeLink);

  rightColumn.append(cardButtons);

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
