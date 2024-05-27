import Bootstrap from '../elements/bootstrap/Bootstrap';
import switchPage from '../elements/switchPage';
import { Pages } from '../elements/types';

export default function catalog() {
  const container = Bootstrap.createElement('div', 'd-flex flex-column justify-content-center align-items-center my-4');
  container.append(Bootstrap.createElement('h2', '', 'Catalog'));
  container.append(goToProductBtn());
  return container;
}

function goToProductBtn() {
  const block = Bootstrap.createElement('div', 'd-flex flex-column justify-content-center align-items-center my-4');

  const btn = Bootstrap.createButton(
    "Go to product 'Mind power into the 21st century'",
    'btn-orange border-0 btn-style-default mx-1',
  );
  btn.addEventListener('click', () => {
    switchPage(Pages.Product, '54c754ea-1ddf-488e-b58f-21f4257ee50a');
  });
  block.append(btn);
  return block;
}
