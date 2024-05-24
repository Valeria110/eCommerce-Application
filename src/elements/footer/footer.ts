import Bootstrap from '../bootstrap/Bootstrap';
import githubIconSrc from './../../img/github-icon.svg';
import './footer.scss';

export default function footer() {
  const contact = Bootstrap.createElement('div', 'footerContact');
  contact.append(
    createContactLink('Belarus, Minsk, Pobediteley Avenue 61', 'https://maps.app.goo.gl/EaNqAM4kFa8vqiFh8'),
  );
  contact.append(createContactLink('+375 (25) 512 33 42', 'tel:+375255123342'));
  contact.append(createContactLink('Lithub-official@gmail.com', 'mailto:Lithub-official@gmail.com'));

  const containver = Bootstrap.createElement('div', 'footerGithub');
  containver.append(createGithubCart('Valeria110', 'https://github.com/Valeria110'));
  containver.append(createGithubCart('MikhailSemenuk', 'https://github.com/MikhailSemenuk'));
  containver.append(createGithubCart('qwgfsehte', 'https://github.com/qwgfsehte'));

  return [contact, containver];
}

function createGithubCart(authorLogin: string, linkUrl: string) {
  const link = Bootstrap.createElement('a', 'icon-link text-decoration-none footerGithub__cart', authorLogin);
  link.href = linkUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const githubIcon = Bootstrap.createElement('img');
  githubIcon.src = githubIconSrc as string;
  link.prepend(githubIcon);

  return link;
}

function createContactLink(contactInfo: string, linkUrl: string) {
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
