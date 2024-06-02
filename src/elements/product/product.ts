// import { modalWindow } from '../../pages/registration-page/variablesForRegistrationPage';
import Bootstrap from '../bootstrap/Bootstrap';
import createElement from '../bootstrap/createElement';
import requestsAPI from '../requestsAPI';
import switchPage from '../switchPage';
import { Pages, Product } from '../types';
import './product.scss';
import * as bootstrap from 'bootstrap';

// TODO: img with proporthios
// TODO: disable add to card & buy without price
// TODO: 🔃 add before fetch
// TODO: Modal widnow slider
// TODO: Modal window and custom slider indicator

let linkMainImg: HTMLElement;
let cardDiscounted: HTMLDivElement;
const updateLinkMainImg = (response: Product, index: number) => {
  // discount only for first page
  if (cardDiscounted) {
    if (index === 0) {
      cardDiscounted.classList.remove('d-none');
    } else {
      cardDiscounted.classList.add('d-none');
    }
  }

  linkMainImg.style.backgroundImage = `url(${response.images[index]})`;
};

export default function product(id: string) {
  console.log(`id product ${id}`); // TODO: del
  const page = Bootstrap.createElement('div', 'd-flex flex-column productPage');

  (async () => {
    const response = await requestsAPI.getProductsByID(id);
    console.log('product response', response);
    if (response) {
      generateProductPage(response, page);
    } else {
      switchPage(Pages.Error404);
    }
  })();

  return page;
}

function generateProductPage(response: Product, page: HTMLDivElement) {
  const cardProduct = Bootstrap.createElement('div', 'productCard');
  cardProduct.append(createLeftColumn(response));
  cardProduct.append(createRightColumn(response));

  const carousel = createCarousel(response);
  const bsCarousel = new bootstrap.Carousel(carousel);
  const indicatorCarosel = createImgTabs(response, (index) => {
    bsCarousel.to(index);
    console.log(index);
  });

  const modal = createModal('productModal', [carousel, indicatorCarosel]);
  const linkTest = Bootstrap.createElement('a', '', 'test');
  linkTest.addEventListener('click', () => showModal(modal));

  carousel.addEventListener('slide.bs.carousel', (event: unknown) => {
    const objEvent = event as object;
    if ('to' in objEvent) {
      console.log('событие слайдер карусели', objEvent.to);
    }
  });

  page.append(
    modal,
    createCatalogPath(response.title),
    cardProduct,
    linkTest,
    Bootstrap.createElement('div', '', 'Place for You might light it'),
  ); // TODO: replace svg icon
}

function createRightColumn(response: Product) {
  const column = Bootstrap.createElement('div', 'productCard__right');

  column.append(Bootstrap.createElement('h2', 'product__title', response.title));
  column.append(Bootstrap.createElement('h3', 'product__author', response.author));

  column.append(Bootstrap.createElement('p', 'product__summary', 'Summary'));

  const description = Bootstrap.createElement('p', 'product__description', response.description);
  column.append(description);

  const link = Bootstrap.createElement('a', 'product__readCompletely d-none', 'Read completely...');

  const disableLinkIfTextFits = () => {
    if (description.scrollHeight > description.offsetHeight) {
      link.classList.remove('d-none');
    } else {
      link.classList.add('d-none');
    }
  };
  setTimeout(() => disableLinkIfTextFits(), 200);
  window.addEventListener('resize', () => disableLinkIfTextFits());

  link.addEventListener('click', (event) => {
    event.preventDefault();
    description.classList.add('product__description-expanded');
    link.classList.add('d-none');
  });
  column.append(link);

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

  const buyBtn = Bootstrap.createButton('Buy', 'btn-orange border-0 m-1 product__btn product__btnBuy');
  const addCartBtn = Bootstrap.createButton('Add to card', 'btn-white m-1 product__btn product__btnAddToCard');
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
  const container = Bootstrap.createElement('div', 'productCard__left');

  container.append(createPreviewsImg(response));
  container.append(createMainImgPage(response));

  return container;
}

function createPreviewsImg(response: Product, limitImg = 3) {
  const container = Bootstrap.createElement('div', 'productPreviewImg');

  if (response.images.length <= 1) {
    return container;
  }

  response.images.forEach((img, index) => {
    if (index < limitImg) {
      const preview = Bootstrap.createElement('div', 'productPreviewImg__img');
      preview.style.backgroundImage = `url(${img})`;

      preview.addEventListener('click', () => console.log(`вызвать модальное с индексом ${index}`));
      container.append(preview);
    }
  });

  return container;
}

function createMainImgPage(response: Product) {
  const containerForCard = createElement('div', '');
  const containerForBook = createElement('div', 'mainImg__cards-body');
  linkMainImg = createElement('div', 'mainImg__cards-cover');

  updateLinkMainImg(response, 0);

  if (response.prices.discounted) {
    cardDiscounted = createElement('div', 'mainImg__cards-discounted', getProcentDiscount(response));
    linkMainImg.append(cardDiscounted);
  }

  containerForCard.append(containerForBook);
  containerForBook.append(linkMainImg);

  const imgTabs = createImgTabs(response, (index) => updateLinkMainImg(response, index));
  containerForCard.append(imgTabs);

  return containerForCard;
}

// function updateActiveIndexImgTabs

function createImgTabs(response: Product, clickCallback: (index: number) => void, startIndex = 0) {
  const dots: HTMLElement[] = [];
  const container = Bootstrap.createElement('div', 'productTabs');

  if (response.images.length <= 1) {
    return container;
  }

  const updateActiveIndex = (index: number) => {
    dots.forEach((item) => item.classList.remove('productTabs__circle_active'));
    const dot = dots.at(index);
    if (dot) {
      dot.classList.add('productTabs__circle_active');
    }
  };

  response.images.forEach((img, index) => {
    const dotWrapper = Bootstrap.createElement('div', 'productTabs__circleWrapper');
    const dot = Bootstrap.createElement('div', 'productTabs__circle');
    dotWrapper.append(dot);

    dotWrapper.addEventListener('click', () => {
      updateActiveIndex(index);
      clickCallback(index);
    });
    dots.push(dot);
    container.append(dotWrapper);
  });

  updateActiveIndex(startIndex);
  return container;
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
  const li2 = Bootstrap.createElement('li', 'breadcrumb-item active catalogPath__title');
  li2.setAttribute('aria-current', 'page');
  li2.textContent = title;
  ol.append(li1, li2);
  nav.append(ol);
  return nav;
}

function createCarousel(response: Product): HTMLElement {
  const carousel = Bootstrap.createElement('div', 'carousel slide my-carousel');
  carousel.id = 'carouselExampleIndicators';

  const indicators = Bootstrap.createElement('ol', 'carousel-indicators');
  const inner = Bootstrap.createElement('div', 'carousel-inner');

  response.images.forEach((image, index) => {
    const indicator = Bootstrap.createElement('button', index === 0 ? ['active'] : []);
    indicator.type = 'button';
    indicator.dataset.bsTarget = '#carouselExampleIndicators';
    indicator.dataset.bsSlideTo = index.toString();
    if (index === 0) {
      indicator.setAttribute('aria-current', 'true');
    }
    indicator.setAttribute('aria-label', `Slide ${index + 1}`);
    indicators.append(indicator);

    const item = Bootstrap.createElement('div', index === 0 ? ['carousel-item', 'active'] : ['carousel-item']);
    const img = Bootstrap.createElement('img', 'd-block w-100');
    img.src = image;
    img.alt = `Slide ${index + 1}`;
    item.append(img);
    inner.append(item);
  });

  const prevButton = Bootstrap.createElement('button', 'carousel-control-prev');
  prevButton.type = 'button';
  prevButton.dataset.bsTarget = '#carouselExampleIndicators';
  prevButton.dataset.bsSlide = 'prev';
  const prevIcon = Bootstrap.createElement('span', 'carousel-control-prev-icon');
  prevIcon.setAttribute('aria-hidden', 'true');
  const prevText = Bootstrap.createElement('span', 'visually-hidden', 'Previous');
  prevButton.append(prevIcon, prevText);

  const nextButton = Bootstrap.createElement('button', 'carousel-control-next');
  nextButton.type = 'button';
  nextButton.dataset.bsTarget = '#carouselExampleIndicators';
  nextButton.dataset.bsSlide = 'next';
  const nextIcon = Bootstrap.createElement('span', 'carousel-control-next-icon');
  nextIcon.setAttribute('aria-hidden', 'true');
  const nextText = Bootstrap.createElement('span', 'visually-hidden', 'Next');
  nextButton.append(nextIcon, nextText);

  carousel.append(indicators, inner, prevButton, nextButton);
  return carousel;
}

function createModal(id: string, bodyContent: HTMLElement[]): HTMLDivElement {
  const modal = Bootstrap.createElement('div', 'modal fade', '');
  modal.id = id;
  modal.tabIndex = -1;
  modal.setAttribute('aria-labelledby', `${id}Label`);
  modal.setAttribute('aria-hidden', 'true');

  const dialog = Bootstrap.createElement('div', 'modal-dialog');
  modal.append(dialog);

  const content = Bootstrap.createElement('div', 'modal-content');
  dialog.append(content);

  const header = Bootstrap.createElement('div', 'modal-header');
  content.append(header);

  const titleElement = Bootstrap.createElement('h1', 'modal-title fs-5', 'Title');
  titleElement.id = `${id}Label`;
  header.append(titleElement);

  const closeButton = Bootstrap.createElement('button', 'btn-close');
  closeButton.type = 'button';
  closeButton.dataset.bsDismiss = 'modal';
  closeButton.setAttribute('aria-label', 'Close');
  header.append(closeButton);

  const body = Bootstrap.createElement('div', 'modal-body');
  body.append(...bodyContent);
  content.append(body);

  return modal;
}

function showModal(modal: HTMLDivElement) {
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
}
