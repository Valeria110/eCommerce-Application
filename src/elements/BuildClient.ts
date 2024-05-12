/* eslint-disable import/no-extraneous-dependencies */

require('isomorphic-fetch');

// fetch('//offline-news-api.herokuapp.com/stories')
//   .then(function (response) {
//     if (response.status >= 400) {
//       throw new Error('Bad response from server');
//     }
//     return response.json();
//   })
//   .then(function (stories) {
//     console.log(stories);
//   });

// import fetch from 'node-fetch';
import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';

const projectKey = 'ecommerce-application-229-key';
const scopes = ['manage_project:ecommerce-application-229-key'];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: projectKey,
  credentials: {
    clientId: 'JL_Yc-5lk6p82qis9ODF1Wp-',
    clientSecret: 'dW1fvP10tPRZLedCbtFPEQZiQQs6bXyX',
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();
