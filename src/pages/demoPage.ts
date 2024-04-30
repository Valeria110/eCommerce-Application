import createElement from '../elements/bootstrap/createElement';
import logoImg from './../img/rs-logo.webp';

export default function demoPage() {
  const h2 = createElement('h2', '', 'Hello world');

  const img = createElement('img', 'rounded-circle me-2');
  img.alt = 'Logo';
  img.src = logoImg as string;
  img.style.width = '40px';

  const answer = createElement('div') as HTMLDivElement;
  answer.append(h2, img);
  return answer;
}
