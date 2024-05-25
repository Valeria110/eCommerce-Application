import Bootstrap from '../bootstrap/Bootstrap';
import githubIconSrc from './../../img/github-icon.svg';
import './footer.scss';

export default function footer() {
  const contacts = Bootstrap.createElement('div', 'footerContact');
  contacts.append(
    createContactLink('Belarus, Minsk, Pobediteley Avenue 61', 'https://maps.app.goo.gl/EaNqAM4kFa8vqiFh8'),
  );
  contacts.append(createContactLink('+375 (25) 512 33 42', 'tel:+375255123342'));
  contacts.append(createContactLink('Lithub-official@gmail.com', 'mailto:Lithub-official@gmail.com'));

  const githubLinks = Bootstrap.createElement('div', 'footerGithub');
  githubLinks.append(createGithubCart('Valeria110', 'https://github.com/Valeria110'));
  githubLinks.append(createGithubCart('MikhailSemenuk', 'https://github.com/MikhailSemenuk'));
  githubLinks.append(createGithubCart('qwgfsehte', 'https://github.com/qwgfsehte'));

  const contatiner = Bootstrap.createElement('footer');
  contatiner.append(contacts, githubLinks);

  return contatiner;
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
