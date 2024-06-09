import Bootstrap from '../../elements/bootstrap/Bootstrap';
import cartTempControlPanel from '../../elements/cartTempControlPanel';

export default function basketPage() {
  const container = Bootstrap.createElement('div', '', 'Basket');

  container.append(cartTempControlPanel());

  return container;
}
