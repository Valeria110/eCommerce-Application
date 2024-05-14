import Bootstrap from '../elements/bootstrap/Bootstrap';
import switchPage from '../elements/switchPage';
import { Pages } from '../elements/types';

export default function signUpPage() {
  const div = Bootstrap.createElement('div');
  const h2 = Bootstrap.createElement('h2', '', 'sign up page');
  const signupBtn = Bootstrap.createButton('sign up', 'btn-orange');
  signupBtn.addEventListener('click', () => {
    switchPage(Pages.Main);
  });
  div.append(h2, signupBtn);
  return div;
}
