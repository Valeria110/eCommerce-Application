import Bootstrap from '../../elements/bootstrap/Bootstrap';
import createElement from '../../elements/bootstrap/createElement';
import { generateSectionPopularBooks } from '../../elements/popularBooks/generateSectionPopularBooks';
import requestsAPI from '../../elements/requestsAPI';
import switchPage from '../../elements/switchPage';
import { Pages, Product } from '../../elements/types';
import './product.scss';
import Modal from 'bootstrap/js/dist/modal';
import Carousel from 'bootstrap/js/dist/carousel';

let linkMainImg: HTMLElement;
let cardDiscounted: HTMLDivElement;
let modalWihCarousel: HTMLDivElement;
let carousel: HTMLElement;
let curentActiveIndex = 0;
const updateLinkMainImg = (response: Product, index: number) => {
  // discount only for first page
  if (cardDiscounted) {
    if (index === 0) {
      cardDiscounted.classList.remove('d-none');
    } else {
      cardDiscounted.classList.add('d-none');
    }
  }

  curentActiveIndex = index;
  linkMainImg.style.backgroundImage = `url(${response.images[index]})`;
};

export default function product(id: string) {
  const page = Bootstrap.createElement('div', 'd-flex flex-column productPage');
  const spinerElement = createLoadingSpiner();
  page.append(spinerElement);

  (async () => {
    const response = await requestsAPI.getProductsByID(id);
    if (response) {
      spinerElement.classList.add('d-none');
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

  carousel = createCarousel(response);
  const bsCarousel = new Carousel(carousel);
  const indicatorCarosel = createImgTabs(response, (index) => {
    bsCarousel.to(index);
  });

  modalWihCarousel = createModal('productModal', [carousel, indicatorCarosel]);

  carousel.addEventListener('slide.bs.carousel', (event: unknown) => {
    const objEvent = event as object;
    if ('to' in objEvent && typeof objEvent.to === 'number') {
      const dots = Array.from(indicatorCarosel.querySelectorAll('.productTabs__circle')) as HTMLElement[];
      updateActiveIndexImgTabs(dots, objEvent.to);
    }
  });

  page.append(
    modalWihCarousel,
    createCatalogPath(response.title),
    cardProduct,
    generateSectionPopularBooks('You might like it'),
  );
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

      preview.addEventListener('click', () => showModalWithCarousel(index));
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

  containerForBook.addEventListener('click', () => showModalWithCarousel(curentActiveIndex));

  return containerForCard;
}

function updateActiveIndexImgTabs(dots: HTMLElement[], index: number) {
  dots.forEach((item) => item.classList.remove('productTabs__circle_active'));
  const dot = dots.at(index);
  if (dot) {
    dot.classList.add('productTabs__circle_active');
  }
}

function createImgTabs(response: Product, clickCallback: (index: number) => void, startIndex = 0) {
  const dots: HTMLElement[] = [];
  const container = Bootstrap.createElement('div', 'productTabs');

  if (response.images.length <= 1) {
    return container;
  }

  response.images.forEach((img, index) => {
    const dotWrapper = Bootstrap.createElement('div', 'productTabs__circleWrapper');
    const dot = Bootstrap.createElement('div', 'productTabs__circle');
    dotWrapper.append(dot);

    dotWrapper.addEventListener('click', () => {
      updateActiveIndexImgTabs(dots, index);
      clickCallback(index);
    });
    dots.push(dot);
    container.append(dotWrapper);
  });

  updateActiveIndexImgTabs(dots, startIndex);
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

function createCarousel(response: Product, startIndex = 0): HTMLElement {
  const carouselId = 'productCarousel';

  const carouselDiv = Bootstrap.createElement('div', 'carousel slide productCarousel');
  carouselDiv.id = carouselId;
  carouselDiv.dataset.bsInterval = 'false'; // Disable automatic sliding

  const inner = Bootstrap.createElement('div', 'carousel-inner');

  response.images.forEach((image, index) => {
    const item = Bootstrap.createElement('div', index === startIndex ? ['carousel-item', 'active'] : ['carousel-item']);
    const img = Bootstrap.createElement('img', 'd-block w-100');
    img.src = image;
    img.alt = `Slide ${index + 1}`;
    item.append(img);
    inner.append(item);
  });

  const prevButton = Bootstrap.createElement('button', 'carousel-control-prev');
  prevButton.type = 'button';
  prevButton.dataset.bsTarget = `#${carouselId}`;
  prevButton.dataset.bsSlide = 'prev';
  const prevIcon = Bootstrap.createElement('span', 'carousel-control-prev-icon');
  prevIcon.setAttribute('aria-hidden', 'true');
  const prevText = Bootstrap.createElement('span', 'visually-hidden', 'Previous');
  prevButton.append(prevIcon, prevText);

  const nextButton = Bootstrap.createElement('button', 'carousel-control-next');
  nextButton.type = 'button';
  nextButton.dataset.bsTarget = `#${carouselId}`;
  nextButton.dataset.bsSlide = 'next';
  const nextIcon = Bootstrap.createElement('span', 'carousel-control-next-icon');
  nextIcon.setAttribute('aria-hidden', 'true');
  const nextText = Bootstrap.createElement('span', 'visually-hidden', 'Next');
  nextButton.append(nextIcon, nextText);

  carouselDiv.append(inner, prevButton, nextButton);

  // Programmatically go to the start index
  if (startIndex !== 0) {
    const bsCarousel = new Carousel(carouselDiv);
    bsCarousel.to(startIndex);
  }
  return carouselDiv;
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

  const header = Bootstrap.createElement('div', 'modal-header border-bottom-0');
  content.append(header);

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

function showModalWithCarousel(index: number) {
  const bootstrapModal = new Modal(modalWihCarousel);
  bootstrapModal.show();

  const bsCarousel = new Carousel(carousel);
  bsCarousel.to(index);
}

function createLoadingSpiner(): HTMLDivElement {
  const container = Bootstrap.createElement('div', 'productSpiner d-flex align-items-center');

  const status = Bootstrap.createElement('strong', '', 'Loading...');
  status.setAttribute('role', 'status');
  container.appendChild(status);

  const spinner = Bootstrap.createElement('div', 'spinner-border ms-auto');
  spinner.className = 'spinner-border ms-auto';
  spinner.setAttribute('aria-hidden', 'true');
  container.appendChild(spinner);

  return container;
}
