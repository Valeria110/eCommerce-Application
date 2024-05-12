import Bootstrap from '../elements/bootstrap/Bootstrap';
import header from '../elements/header/header';
import { testSDK, fetchToken, checkCustomer } from '../elements/requests';

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
    console.log('==== test sdk =====');
    testSDK();
  });

  const btnSignUp = Bootstrap.createButton('fetch token', 'btn-warning m-2');
  btnSignUp.addEventListener('click', () => {
    console.log('==== sign up =====');
    fetchToken('test@gmail.com', 'TestTest1#');
  });

  const btnCheckCustomer = Bootstrap.createButton('check customer by email', 'btn-warning m-2');
  btnCheckCustomer.addEventListener('click', () => {
    console.log('==== check customer =====');
    checkCustomer('test11111@gmail.com');
  });

  div.append(btnTest, btnSignUp, btnCheckCustomer);
  return div;
}
