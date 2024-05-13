import requestFetch from '../elements/requestsFetch';
import Bootstrap from '../elements/bootstrap/Bootstrap';
import header from '../elements/header/header';

export default function mainPage() {
  const div = Bootstrap.createElement('div');
  div.append(header());

  const btnSignIn = Bootstrap.createButton('fetch user token', 'btn-success m-2');
  btnSignIn.addEventListener('click', () => {
    console.log('==== sign in =====');
    // test@gmail.com
    // TestTest1#

    // simple@gmail.com
    // simple
    // TODO: Doesn't work with test@gmail.com
    requestFetch
      .authCustomersToken('test________@gmail.com', 'TestTest1#_')
      .then((obj) => {
        console.log(`obj then = ${JSON.stringify(obj)}`);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  });

  const btnCustomerExist = Bootstrap.createButton('exist customer', 'btn-success m-2');
  btnCustomerExist.addEventListener('click', () => {
    console.log('==== exist customer =====');
    requestFetch
      .isExistCustomer('test111@gmail.com')
      .then((isExist) => {
        console.log(`is Exist = ${isExist}`);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  });

  const btnProducts = Bootstrap.createButton('get products', 'btn-success m-2');
  btnProducts.addEventListener('click', () => {
    console.log('==== products =====');
    requestFetch.getProducts();
  });

  div.append(btnSignIn, btnCustomerExist, btnProducts);
  return div;
}
