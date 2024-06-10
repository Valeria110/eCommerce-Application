import Bootstrap from '../../elements/bootstrap/Bootstrap';
import cart from '../../elements/cart';
import cartTempControlPanel from '../../elements/cartTempControlPanel';
import switchPage from '../../elements/switchPage';
import { AppEvents, Pages, ProductCart } from '../../elements/types';
import { convertCentsToDollars } from '../../libs/convertCentsToDollars';
import './basketPage.scss';

export default function basketPage() {
  const container = Bootstrap.createElement('div', 'basketPage', 'Basket');

  const productList = Bootstrap.createElement('div', 'basketProductList');
  const renderProductList = () => {
    console.log('render product list'); // TODO
    productList.innerHTML = '';
    cart.products.forEach((product) => {
      productList.append(createProductCard(product));
    });
  };
  renderProductList();
  document.body.addEventListener(AppEvents.createCart, () => renderProductList());

  const generateBtn = Bootstrap.createButton('generate', 'btn-orange border-0 m-1');
  generateBtn.addEventListener('click', () => renderProductList());

  const productSummary = Bootstrap.createElement('div', 'd-flex justify-content-between');
  productSummary.append(productList, createSummary());

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
    textLeft: string,
    textRight: string,
    style: 'basketSummary__boldLine' | 'basketSummary__grayLine',
  ) => {
    const line = Bootstrap.createElement('div', 'd-flex justify-content-between');
    line.classList.add(style);
    const text = Bootstrap.createElement('span', '', textLeft);
    const price = Bootstrap.createElement('span', '', textRight);
    line.append(text, price);
    return { line, text, price };
  };

  const line1 = createPriceLine('The amount without discount', '0$', 'basketSummary__grayLine');
  const line2 = createPriceLine('Discount', '0$', 'basketSummary__grayLine');
  const line3 = createPriceLine('Promocode', '0$', 'basketSummary__grayLine');
  const line4 = createPriceLine('Total', '0$', 'basketSummary__boldLine');
  const lines = Bootstrap.createElement('div', 'basketSummary__linesWrapper');

  const recalculateLinePrices = () => {
    line1.price.textContent = convertCentsToDollars(cart.regularPriceCentAmount);
    line2.price.textContent = convertCentsToDollars(cart.regularPriceCentAmount - cart.totalPriceCentAmount);
    line4.price.textContent = convertCentsToDollars(cart.totalPriceCentAmount);
    console.log(`totalPriceCentAmount = ${cart.totalPriceCentAmount}`);
  };
  recalculateLinePrices();

  document.body.addEventListener(AppEvents.updateCounterCart, () => recalculateLinePrices());

  lines.append(line1.line, line2.line, line3.line, line4.line);

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
  const title = Bootstrap.createElement('h2', 'basketProduct__title', product.title);
  rightColumn.append(title);
  rightColumn.append(Bootstrap.createElement('h3', 'basketProduct__author', product.author));

  const pricesWraper = Bootstrap.createElement('div', 'd-flex');
  console.log(product.prices.discounted);
  if (product.prices.regular !== product.prices.discounted) {
    pricesWraper.append(
      Bootstrap.createElement('div', 'basketProduct__price', convertCentsToDollars(product.prices.discounted ?? 0)),
    );
    pricesWraper.append(
      Bootstrap.createElement('div', 'basketProduct__pricePrevios', convertCentsToDollars(product.prices.regular)),
    );
  } else {
    pricesWraper.append(
      Bootstrap.createElement('div', 'basketProduct__price', convertCentsToDollars(product.prices.regular)),
    );
  }
  rightColumn.append(pricesWraper);

  const cardButtons = Bootstrap.createElement('div', 'basketProduct__cardButtons');

  const removeLink = Bootstrap.createElement('a', 'basketProduct__removeLink', 'remove');
  removeLink.addEventListener('click', (event) => {
    event.preventDefault();
    cart.removeProduct(product.id).then(() => container.classList.add('d-none'));
  });
  cardButtons.append(createQuantityInput(product, container), removeLink);

  rightColumn.append(cardButtons);

  imageElement.addEventListener('click', () => switchPage(Pages.Product, product.productId));
  title.addEventListener('click', () => switchPage(Pages.Product, product.productId));

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
