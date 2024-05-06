import UserData from '../elements/UserData';
import Bootstrap from '../elements/bootstrap/Bootstrap';
import switchPage from '../elements/switchPage';
import { Pages } from '../elements/types';

export default function loginPage() {
  const div = Bootstrap.createElement('div');
  const h2 = Bootstrap.createElement('h2', '', 'login page');
  const loginBtn = Bootstrap.createButton('login', 'btn-orange');
  loginBtn.addEventListener('click', () => {
    UserData.isLogined = true;
    switchPage(Pages.Main);
  });
  div.append(h2, loginBtn);
  return div;
}
