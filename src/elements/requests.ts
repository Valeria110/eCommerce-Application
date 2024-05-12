/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ctpClient } from './BuildClient';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const testSDK = () => {
  console.log('test SDK');
  const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: 'ecommerce-application-229-key',
  });
  // check if work api Root
  apiRoot.get().execute();
};

const getUserToken = async (email: string, password: string) => {
  console.log('test');
};

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

export { testSDK, getUserToken };
