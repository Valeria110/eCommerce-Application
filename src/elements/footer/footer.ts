import Bootstrap from '../bootstrap/Bootstrap';
import githubIconSrc from './../../img/github-icon.svg';
import './footer.scss';

export default function footer() {
  const containver = Bootstrap.createElement('div', 'footer');

  containver.append(createCart('Valeria110', 'https://github.com/Valeria110'));
  containver.append(createCart('MikhailSemenuk', 'https://github.com/MikhailSemenuk'));
  containver.append(createCart('qwgfsehte', 'https://github.com/qwgfsehte'));
  return containver;
}

function createCart(authorLogin: string, linkUrl: string) {
  const link = Bootstrap.createElement('a', 'icon-link text-decoration-none footer__cart', authorLogin);
  link.href = linkUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const githubIcon = Bootstrap.createElement('img');
  githubIcon.src = githubIconSrc as string;
  link.prepend(githubIcon);

  return link;
}
