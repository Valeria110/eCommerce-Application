import Bootstrap from '../bootstrap/Bootstrap';
import githubIconSrc from './../../img/github-icon.svg';
import './footer.scss';

export default function footer() {
  const contact = Bootstrap.createElement('div', 'footerContact');
  contact.append(createLink('Belarus, Minsk, Pobediteley Avenue 61', 'https://maps.app.goo.gl/EaNqAM4kFa8vqiFh8'));
  contact.append(createLink('+375 (25) 512 33 42', 'tel:+375255123342'));
  contact.append(createLink('Lithub-official@gmail.com', 'mailto:Lithub-official@gmail.com'));

  const containver = Bootstrap.createElement('div', 'footer');
  containver.append(createCart('Valeria110', 'https://github.com/Valeria110'));
  containver.append(createCart('MikhailSemenuk', 'https://github.com/MikhailSemenuk'));
  containver.append(createCart('qwgfsehte', 'https://github.com/qwgfsehte'));

  return [contact, containver];
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

function createLink(contactInfo: string, linkUrl: string) {
  const link = Bootstrap.createElement('a', 'text-decoration-none footerContact__cart', contactInfo);
  link.href = linkUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  if (linkUrl.startsWith('mailto:')) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = linkUrl;
    });
  } else {
    link.addEventListener('click', () => {
      window.open(linkUrl, '_blank');
    });
  }

  return link;
}
