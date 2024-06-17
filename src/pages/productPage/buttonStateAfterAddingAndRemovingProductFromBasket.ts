import cart from '../../elements/cart';

export async function buttonAndModalStateAtAddProductInCart(
  buttonAdd: HTMLButtonElement,
  nameProduct: string,
  titleModalWindow: HTMLDivElement,
  shadowButton: HTMLButtonElement,
) {
  if (cart.id) {
    cart.addProduct(buttonAdd.id);
    titleModalWindow.textContent = `Product "${nameProduct}" (1 pc.) has been successfully added to the cart.`;
  } else {
    await cart.createCart();
    cart.addProduct(buttonAdd.id);
    titleModalWindow.textContent = `Your cart has been successfully created, and the item "${nameProduct}" (1 pc.) has been added to it.`;
  }

  buttonAdd.textContent = 'In the cart';
  buttonAdd.classList.add('disabled');
  buttonAdd.classList.add('catalog-page__button-cart_inactive');
  document.body.classList.add('catalog-page__active-modal');
  shadowButton.click();
  document.querySelectorAll('.modal-backdrop').forEach((item) => item.classList.add('custom-modal-backdrop'));
}

export async function buttonAndModalStateAtRemoveProductInCart(
  buttonRemove: HTMLButtonElement,
  buttonAdd: HTMLButtonElement,
  nameProduct: string,
  titleModalWindow: HTMLDivElement,
  shadowButton: HTMLButtonElement,
) {
  try {
    await cart.removeProduct(buttonRemove.id);
    titleModalWindow.textContent = `The product "${nameProduct}" was successfully removed from the cart!`;
    buttonAdd.textContent = 'Add to cart';
    buttonAdd.classList.remove('disabled');
    buttonAdd.classList.remove('catalog-page__button-cart_inactive');
    buttonRemove.style.display = 'none';
  } catch (error) {
    titleModalWindow.textContent = `Error: Failed to remove "${nameProduct}" from the cart.`;
  }

  document.body.classList.add('catalog-page__active-modal');
  shadowButton.click();
  document.querySelectorAll('.modal-backdrop').forEach((item) => item.classList.add('custom-modal-backdrop'));
}
