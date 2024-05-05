/* eslint-disable @typescript-eslint/no-use-before-define */ // TODO: in bootstrap object
import Bootstrap from '../bootstrap/Bootstrap';
import logoImg from './../../img/logo.svg';
import './header.scss';

export default function header(): HTMLElement {
  const headerElement = Bootstrap.createElement('nav', 'navbar navbar-expand-lg bg-body-tertiary');
  const headerContainer = Bootstrap.createElement('div', 'container-fluid');

  const brand = Bootstrap.createElement('a', 'navbar-brand', 'LitHub');
  brand.href = '#';
  const logo = Bootstrap.createElement('img', 'd-inline-block align-top');
  logo.width = 47;
  logo.src = logoImg as string;
  brand.prepend(logo);

  // const brand = Bootstrap.createElement('a', 'navbar-brand', 'Navbar');
  // brand.href = '#';

  const button = Bootstrap.createElement('button', 'navbar-toggler');
  button.type = 'button';
  button.dataset.toggle = 'collapse';
  button.dataset.target = '#navbarNav';
  button.setAttribute('aria-controls', 'navbarNav');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Toggle navigation');
  const buttonSpan = Bootstrap.createElement('span', 'navbar-toggler-icon');
  button.append(buttonSpan);

  const collapseDiv = Bootstrap.createElement('div', 'collapse navbar-collapse'); // 'collapse navbar-collapse'
  collapseDiv.id = 'navbarNav';
  const ul = Bootstrap.createElement('ul', 'navbar-nav');
  ul.append(createNavItem('Main', true));
  ul.append(createNavItem('Catalog', false, true));
  ul.append(createNavItem('About us', false, true));
  collapseDiv.append(ul);

  const logIn = createButton('Log in', 'btn-orange');

  headerContainer.append(brand, button, collapseDiv, logIn);
  headerElement.append(headerContainer);
  return headerElement;
}

function createNavItem(text = '', isActive = true, isDisabled = false) {
  const li = Bootstrap.createElement('li', 'nav-item');
  if (isActive) {
    li.classList.add('active');
  }

  const a = Bootstrap.createElement('a', 'nav-link', text);
  a.href = '#';
  if (isDisabled) {
    a.classList.add('disabled');
  }
  li.append(a);
  return li;
}

function createButton(textContent: string, className = '', clickHandler?: (event: Event) => void): HTMLButtonElement {
  const button = Bootstrap.createElement('button', className);
  button.type = 'button';
  button.classList.add('btn');
  // button.classList.add('defaultBtn');
  button.textContent = textContent;
  if (typeof clickHandler === 'function') {
    button.addEventListener('click', clickHandler);
  }
  return button;
}

// <nav class="navbar navbar-expand-lg navbar-light bg-light">
// <a class="navbar-brand" href="#">Navbar</a>
// <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//   <span class="navbar-toggler-icon"></span>
// </button>
// <div class="collapse navbar-collapse" id="navbarNav">
//   <ul class="navbar-nav">
//     <li class="nav-item active">
//       <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
//     </li>
//     <li class="nav-item">
//       <a class="nav-link" href="#">Features</a>
//     </li>
//     <li class="nav-item">
//       <a class="nav-link" href="#">Pricing</a>
//     </li>
//     <li class="nav-item">
//       <a class="nav-link disabled" href="#">Disabled</a>
//     </li>
//   </ul>
// </div>
// </nav>
