import Bootstrap from '../bootstrap/Bootstrap';
import './loader.scss';

export default function () {
  const mask = Bootstrap.createElement(
    'div',
    'loader-mask d-flex flex-column justify-content-center align-items-center position-fixed top-0 left-0 d-none',
  );
  const loadingText = Bootstrap.createElement('p', 'loader-text h3', 'Loading...');
  const loader = Bootstrap.createElement('div', 'loader d-flex justify-content-center align-items-center');
  const loaderImg = Bootstrap.createElement('img', 'loader-img');
  loaderImg.src = '../../img/lithub-logo.svg' as string;
  loader.append(loaderImg);
  mask.append(loader, loadingText);

  window.addEventListener('load', () => {
    mask.classList.remove('d-none');

    setTimeout(() => {
      mask.classList.add('d-none');
    }, 500);
  });

  return mask;
}
