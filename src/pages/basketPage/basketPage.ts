import Bootstrap from '../../elements/bootstrap/Bootstrap';
import cart from '../../elements/cart';
import switchPage from '../../elements/switchPage';
import { AppEvents, Pages, ProductCart } from '../../elements/types';
import { convertCentsToDollars } from '../../libs/convertCentsToDollars';
import emojiSadSrc from './../../img/emoji-sad.png';
import './basketPage.scss';
import Modal from 'bootstrap/js/dist/modal';

export default function basketPage() {
  const container = Bootstrap.createElement('div', 'basketPage');

  const productList = Bootstrap.createElement('div', 'basketProductList');
  const renderProductList = () => {
    productList.innerHTML = '';
    cart.products.forEach((product) => {
      productList.append(createProductCard(product));
    });
  };
  renderProductList();
  document.body.addEventListener(AppEvents.createCart, () => renderProductList());

  const productAndSummary = Bootstrap.createElement('div', 'productAndSummary');
  productAndSummary.append(productList, createSummary());

  const modalWarning = createModalWarning();
  const bootstrapModal = new Modal(modalWarning.modal);
  const clearShoppingCartBtn = Bootstrap.createButton('Clear Shoping Cart', 'btn-danger basketPage__clearBtn');
  clearShoppingCartBtn.addEventListener('click', () => bootstrapModal.show());
  modalWarning.activeBtn.addEventListener('click', () => {
    cart.clearCart().then(() => bootstrapModal.hide());
  });

  const emptyBasket = createEmptyBasket();

  const switchBetwenEmptyOrNotBacket = () => {
    container.innerHTML = '';
    if (!cart.counter) {
      container.append(emptyBasket);
    } else {
      container.append(productAndSummary, clearShoppingCartBtn, modalWarning.modal);
    }
  };
  switchBetwenEmptyOrNotBacket();
  document.body.addEventListener(AppEvents.updateCart, () => switchBetwenEmptyOrNotBacket());

  return container;
}

function createEmptyBasket() {
  const wrapper = Bootstrap.createElement('div', 'emptyBasketWrapper');
  const container = Bootstrap.createElement('div', 'emptyBasket');

  const img = Bootstrap.createElement('img', 'emptyBasket__img');
  img.src = emojiSadSrc as string;

  const text = Bootstrap.createElement('div', 'emptyBasket__text', 'the cart is empty');

  const goShoppingBtn = Bootstrap.createButton('Go to shoping', 'btn-orange border-0 emptyBasket__btn');
  goShoppingBtn.addEventListener('click', () => switchPage(Pages.Catalog));

  container.append(img, text, goShoppingBtn);
  wrapper.append(container);
  return wrapper;
}

function createSummary() {
  const container = Bootstrap.createElement('div', 'basketSummary');

  const title = Bootstrap.createElement('h2', 'basketSummary__title', 'Summary');

  const titlePromo = Bootstrap.createElement('h4', 'basketSummary__titlePromo', 'Promocode');

  const promoGroup = Bootstrap.createElement('div', 'input-group has-validation mb-1');
  const promoGroupId = 'basketPromoInput';

  const promoInput = Bootstrap.createElement('input', 'form-control');
  promoInput.setAttribute('type', 'text');
  promoInput.setAttribute('placeholder', 'Promocode');
  promoInput.setAttribute('aria-label', 'Promocode');
  promoInput.setAttribute('aria-describedby', promoGroupId);

  const promoInputInvalidFeedback = Bootstrap.createElement('div', 'invalid-feedback');

  const promoButton = Bootstrap.createElement('button', 'btn btn-orange basketSummary__apply', 'Apply');
  promoButton.setAttribute('type', 'button');
  promoButton.setAttribute('id', promoGroupId);

  promoInput.addEventListener('input', () => {
    promoInput.classList.remove('is-valid', 'is-invalid');
  });
  promoButton.addEventListener('click', () => {
    if (!promoInput.value.trim()) {
      return;
    }
    cart.applyDiscountCode(promoInput.value.trim()).then(({ status, message }) => {
      if (status) {
        promoInput.classList.add('is-valid');
        setTimeout(() => {
          promoInput.value = '';
          promoInput.classList.remove('is-valid');
        }, 2000);
      } else {
        promoInput.classList.add('is-invalid');
        promoInputInvalidFeedback.textContent = message;
      }
    });
  });

  const promocodeList = Bootstrap.createElement('div', 'basketSummary__promocodeList');
  const updatePromocodeBadges = () => {
    promocodeList.innerHTML = '';
    cart.discountCodes.forEach((id) => {
      promocodeList.append(
        Bootstrap.createElement('span', 'badge rounded-pill text-bg-warning', cart.discountIdName.get(id)),
      );
    });
  };
  updatePromocodeBadges();

  promoGroup.append(promoInput, promoButton, promoInputInvalidFeedback);

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

  const lineRegular = createPriceLine('The amount without discount', '0$', 'basketSummary__grayLine');
  const lineDiscount = createPriceLine('Discount', '0$', 'basketSummary__grayLine');
  const lineTotal = createPriceLine('Total', '0$', 'basketSummary__boldLine');
  const lines = Bootstrap.createElement('div', 'basketSummary__linesWrapper');

  const recalculateLinePrices = () => {
    lineRegular.price.textContent = convertCentsToDollars(cart.regularPriceCentAmount);
    lineDiscount.price.textContent = convertCentsToDollars(cart.regularPriceCentAmount - cart.totalPriceCentAmount);
    lineTotal.price.textContent = convertCentsToDollars(cart.totalPriceCentAmount);
  };
  recalculateLinePrices();

  document.body.addEventListener(AppEvents.updateCart, () => {
    recalculateLinePrices();
    updatePromocodeBadges();
  });

  lines.append(lineRegular.line, lineDiscount.line, lineTotal.line);

  container.append(title, titlePromo, promoGroup, promocodeList, lines, checkOutBtn);
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

  const minPrice = Math.min(...Object.values(product.prices));
  if (product.prices.regular !== minPrice) {
    pricesWraper.append(Bootstrap.createElement('div', 'basketProduct__price', convertCentsToDollars(minPrice)));
    pricesWraper.append(
      Bootstrap.createElement('div', 'basketProduct__pricePrevios', convertCentsToDollars(product.prices.regular)),
    );
  } else {
    pricesWraper.append(
      Bootstrap.createElement('div', 'basketProduct__price', convertCentsToDollars(product.prices.regular)),
    );
  }

  const totalSum = Bootstrap.createElement('div', 'my-1');
  const updateTotalSum = (localProduct: ProductCart) => {
    const min = Math.min(...Object.values(product.prices));
    totalSum.textContent = `total: ${convertCentsToDollars(min * localProduct.quantity)}`;
  };
  updateTotalSum(product);
  document.body.addEventListener(AppEvents.updateCart, () => {
    const updateCard = cart.products.find((item) => item.id === product.id);
    if (updateCard) {
      updateTotalSum(updateCard);
    }
  });

  rightColumn.append(pricesWraper, totalSum);

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

function createModalWarning() {
  const modal = Bootstrap.createElement('div', 'modal');
  modal.setAttribute('tabindex', '-1');

  const dialog = Bootstrap.createElement('div', 'modal-dialog');
  modal.append(dialog);

  const content = Bootstrap.createElement('div', 'modal-content');
  dialog.append(content);

  const header = Bootstrap.createElement('div', 'modal-header');
  content.append(header);

  const title = Bootstrap.createElement('h5', 'modal-title', 'Warning');
  header.append(title);

  const closeButton = Bootstrap.createElement('button', 'btn-close');
  closeButton.setAttribute('data-bs-dismiss', 'modal');
  header.append(closeButton);
  header.append(closeButton);

  const body = Bootstrap.createElement('div', 'modal-body');
  const bodyText = Bootstrap.createElement(
    'p',
    '',
    'Warning! Proceeding will empty your cart and the characters from these books might forget their stories. Are you sure you want to risk it?',
  );
  body.append(bodyText);
  content.append(body);

  const footer = Bootstrap.createElement('div', 'modal-footer');
  content.append(footer);

  const closeFooterBtn = Bootstrap.createElement('button', 'btn btn-secondary', 'Close');
  closeFooterBtn.setAttribute('data-bs-dismiss', 'modal');
  footer.append(closeFooterBtn);

  const activeBtn = Bootstrap.createElement('button', 'btn btn-danger', 'Yes, clear');
  footer.append(activeBtn);

  return { modal, activeBtn };
}
