import Bootstrap from '../elements/bootstrap/Bootstrap';
import './error404Page.scss';
import errImg from '../img/error-img.png';
import homeIcon from '../img/home-icon.svg';
import header from '../elements/header/header';
import switchPage from '../elements/switchPage';
import { Pages } from '../elements/types';

function error404Page(): HTMLElement[] {
  const headerElem = header();
  const errorWrapper = Bootstrap.createElement('div', [
    'error-wrapper',
    'd-flex',
    'flex-column',
    'justify-content-center',
    'align-items-center',
  ]);
  const errorImg = Bootstrap.createElement('img', 'error-wrapper__img');
  errorImg.src = errImg as string;
  const errorContentBlock = Bootstrap.createElement('div', [
    'error-content-block',
    'd-flex',
    'flex-column',
    'justify-content-center',
    'align-items-center',
  ]);
  const errorTitle = Bootstrap.createElement('h1', ['error-content-block__title', 'fs-1'], 'Page not found');
  const errorDesc = Bootstrap.createElement(
    'p',
    ['error-content-block__error-desc', 'fs-6'],
    'The page you are looking for might have been removed had its name changed or is temporarily unavailable.',
  );
  const homeBtn = document.createElement('button');
  homeBtn.classList.add('error-content-block__home-btn', 'btn');
  const homeBtnContent = Bootstrap.createElement('div', 'home-btn__content');
  const homeBtnIcon = Bootstrap.createElement('img', 'home-btn__icon');
  homeBtnIcon.src = homeIcon as string;
  const homeBtnText = Bootstrap.createElement('span', 'home-btn__text', 'Go to homepage');
  homeBtnContent.append(homeBtnIcon, homeBtnText);
  homeBtn.append(homeBtnContent);
  homeBtn.addEventListener('click', () => {
    switchPage(Pages.Main);
  });

  errorContentBlock.append(errorTitle, errorDesc, homeBtn);
  errorWrapper.append(errorImg, errorContentBlock);
  return [headerElem, errorWrapper];
}

export { error404Page };
