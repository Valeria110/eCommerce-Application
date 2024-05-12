/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import signUpPage from 'src/pages/signUpPage';
import { ctpClient } from './BuildClient';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'ecommerce-application-229-key',
});

const testSDK = () => {
  console.log('test SDK');
  // check if work api Root
  apiRoot.get().execute();
};

const fetchToken = async (username: string, password: string) => {
  const authUrl = process.env.CTP_AUTH_URL;
  const projectKey = process.env.CTP_PROJECT_KEY;

  const url = `${authUrl}/oauth/${projectKey}/customers/token?grant_type=password&username=${username}&password=${password}`;
  console.log('try url ', url);
  console.log(`username = ${username}, 'password' = ${password}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const checkCustomer = async (email = 'test@gmail.com') => {
  const returnCustomerByEmail = (customerEmail: string) => {
    return apiRoot
      .customers()
      .get({
        queryArgs: {
          where: `email="${customerEmail}"`,
        },
      })
      .execute();
  };
  returnCustomerByEmail('test@gmail.com')
    .then(({ body }) => {
      // As email addresses must be unique, either 0 or 1 Customers will be returned.
      // If 0, then no Customer exists with this email address.
      if (body.results.length == 0) {
        console.log('This email address has not been registered.');
      } else {
        // Since there can be only one Customer resource in the result, it must be the first entry of the results array. This outputs the Customer's id.
        console.log('This email found');
        console.log(body.results[0].id);
      }
    })
    .catch(console.error);
};

const getUserToken = async (email: string, password: string) => {
  console.log('test');
};

const getUserTokenFetch = async (email: string, password: string) => {
  const CTP_CLIENT_ID = process.env.CTP_CLIENT_ID;
  const CTP_CLIENT_SECRET = process.env.CTP_CLIENT_SECRET;
  // const authString = `${CTP_CLIENT_ID}:${CTP_CLIENT_SECRET}`;
  const base64Auth = btoa(`${CTP_CLIENT_ID}:${CTP_CLIENT_SECRET}`);

  const authHost = process.env.CTP_AUTH_URL;
  const projectKey = process.env.CTP_PROJECT_KEY;
  const scope = process.env.scope;

  const response = await fetch(`${authHost}/oauth/${projectKey}/customers/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64Auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=password&username=${email}&password=${password}&scope=${scope}`,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  console.log(response.json());
  return response;
};

// const signUp =

// found email
// const returnCustomerByEmail = (customerEmail: string) => {
//   return apiRoot
//     .customers()
//     .get({
//       queryArgs: {
//         where: `email="${customerEmail}"`,
//       },
//     })
//     .execute();
// };
// returnCustomerByEmail('test@gmail.com')
//   .then(({ body }) => {
//     // As email addresses must be unique, either 0 or 1 Customers will be returned.
//     // If 0, then no Customer exists with this email address.
//     if (body.results.length == 0) {
//       console.log('This email address has not been registered.');
//     } else {
//       // Since there can be only one Customer resource in the result, it must be the first entry of the results array. This outputs the Customer's id.
//       console.log('This email found');
//       console.log(body.results[0].id);
//     }
//   })
//   .catch(console.error);

// test sign up - work
// apiRoot
//   .customers()
//   .post({
//     // The CustomerDraft is the object within the body
//     body: {
//       email: 'test@gmail.com',
//       password: 'TestTest1#',
//     },
//   })
//   .execute();

// const getProducts = async () => {
//   const host = process.env.CTP_API_URL;
//   const projectKey = process.env.CTP_PROJECT_KEY;
//   const ctpAccessToken = process.env.CTP_ACCESS_TOKEN;

//   try {
//     const response = await fetch(`${host}/${projectKey}/products`, {
//       headers: {
//         Authorization: `Bearer ${ctpAccessToken}`,
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         console.error('Нужно обновить токен');
//       }
//       throw new Error(`Ошибка HTTP: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`Ошибка при выполнении GET-запроса: ${error}`);
//   }
// };

// const getToken = async () => {
//   const clientId = process.env.CTP_CLIENT_ID;
//   const clientSecret = process.env.CTP_CLIENT_SECRET;
//   const authUrl = process.env.CTP_AUTH_URL;
//   const scope = process.env.scope;
//   console.log(clientId, clientSecret, authUrl, scope);

//   try {
//     const response = await fetch(`${authUrl}/oauth/token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
//       },
//       body: `grant_type=client_credentials&scope=${scope}`,
//     });

//     if (!response.ok) {
//       throw new Error(`Ошибка HTTP: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.access_token;
//   } catch (error) {
//     console.error(`Ошибка при получении токена: ${error}`);
//   }
// };

export { testSDK, getUserToken, checkCustomer, fetchToken };
