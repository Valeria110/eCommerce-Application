import Bootstrap from './bootstrap/Bootstrap';
import cart from './cart';

export default function cartTempControlPanel() {
  const container = Bootstrap.createElement('div', '', 'Cart interface');

  const createCart = Bootstrap.createButton('Create', 'btn-orange border-0 m-1');
  createCart.addEventListener('click', () => cart.createCart());

  const getCartId = Bootstrap.createButton('get cart id', 'btn-white m-1');
  getCartId.addEventListener('click', () => cart.getCartId());

  const getCounter = Bootstrap.createButton('get counter', 'btn-white m-1');
  getCounter.addEventListener('click', () => console.log(cart.counter));

  const showCart = Bootstrap.createButton('show products in cart', 'btn-white m-1');
  showCart.addEventListener('click', () => console.log(cart.lineItems));

  container.append(createCart, getCartId, getCounter, showCart);
  return container;
}