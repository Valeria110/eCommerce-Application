import Bootstrap from '../elements/bootstrap/Bootstrap';
import header from '../elements/header/header';
import { testSDK, getUserToken } from '../elements/requests';

export default function mainPage() {
  const div = Bootstrap.createElement('div');
  div.append(header());

  // console.log(`env API_URL = ${process.env.API_URL}`);
  // console.log(`env CTP_PROJECT_KEY = ${process.env.CTP_PROJECT_KEY}`);

  // const btnProducts = Bootstrap.createButton('get products', 'btn-primary m-2');
  // btnProducts.addEventListener('click', () => console.log(getProducts()));

  // const btnToken = Bootstrap.createButton('get token', 'btn-primary m-2');
  // btnToken.addEventListener('click', () => console.log(getToken()));

  const btnTest = Bootstrap.createButton('test sdk', 'btn-warning m-2');
  btnTest.addEventListener('click', () => {
    testSDK();
  });

  const btnSignUp = Bootstrap.createButton('withPasswordFlow', 'btn-warning m-2');
  btnSignUp.addEventListener('click', () => {
    getUserToken('test@gmail.com', 'TestTest1#');
  });

  div.append(btnTest, btnSignUp);
  return div;
}
