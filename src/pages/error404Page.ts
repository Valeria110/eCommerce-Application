import Bootstrap from '../elements/bootstrap/Bootstrap';

export default function error404Page() {
  const div = Bootstrap.createElement('div');
  const h2 = Bootstrap.createElement('h2', '', '404');
  div.append(h2, h2);
  return div;
}
