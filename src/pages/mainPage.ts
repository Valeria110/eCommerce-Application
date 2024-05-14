import Bootstrap from '../elements/bootstrap/Bootstrap';
import header from '../elements/header/header';

export default function mainPage() {
  const div = Bootstrap.createElement('div');
  div.append(header());
  return div;
}
