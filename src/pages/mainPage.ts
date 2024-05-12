import requestFetch from '../elements/requestsFetch';
import Bootstrap from '../elements/bootstrap/Bootstrap';
import header from '../elements/header/header';
import { testSDK, checkCustomer } from '../elements/requests';

export default function mainPage() {
  const div = Bootstrap.createElement('div');
  div.append(header());

  const btnTest = Bootstrap.createButton('test sdk', 'btn-warning m-2');
  btnTest.addEventListener('click', () => {
    console.log('==== test sdk =====');
    testSDK();
  });

  const btnSignUp = Bootstrap.createButton('fetch token', 'btn-success m-2');
  btnSignUp.addEventListener('click', () => {
    console.log('==== sign up =====');
    // test@gmail.com
    // TestTest1#

    // simple@gmail.com
    // simple
    // TODO: Doesn't work with test@gmail.com
    const status = requestFetch.getCustomersToken('simple@gmail.com', 'simple');
    console.log(`status = ${status}`);
  });

  const btnCheckCustomer = Bootstrap.createButton('check customer by email', 'btn-warning m-2');
  btnCheckCustomer.addEventListener('click', () => {
    console.log('==== check customer =====');
    checkCustomer('test11111@gmail.com');
  });

  div.append(btnTest, btnSignUp, btnCheckCustomer);
  return div;
}
