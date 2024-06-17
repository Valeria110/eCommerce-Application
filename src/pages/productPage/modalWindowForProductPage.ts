import createElement from '../../elements/bootstrap/createElement';

export const shadowButtonProductPage = createElement('button', 'btn btn-primary d-none');
shadowButtonProductPage.setAttribute('data-bs-toggle', 'modal');
shadowButtonProductPage.setAttribute('data-bs-target', '#productPage');

export const containerForModalWindowProductPage = createElement('div', 'modal fade modal_registration_successful');
containerForModalWindowProductPage.id = 'productPage';
containerForModalWindowProductPage.setAttribute('tabindex', '-1');
containerForModalWindowProductPage.setAttribute('aria-hidden', 'true');
export const modalWindowProductPage = createElement('div', 'modal-dialog');
export const contentModalWindowProductPage = createElement('div', 'modal-content');
export const headerModalWindowProductPage = createElement('div', 'modal-header');
export const titleModalWindowProductPage = createElement('h6', 'modal-title');
export const buttonCloseModalWindowProductPage = createElement('button', 'btn-close');
buttonCloseModalWindowProductPage.setAttribute('data-bs-dismiss', 'modal');
export const bodyModalWindowProductPage = createElement('div', 'modal-body');
export const textbodyModalWindowProductPage = createElement('div');
textbodyModalWindowProductPage.innerHTML = 'You can continue shopping or proceed to checkout. 🛍️✨';
export const buttonCartProductPage = createElement('div', 'btn catalog-page__button-cart_open', 'Go to the cart');
buttonCartProductPage.setAttribute('data-bs-dismiss', 'modal');
