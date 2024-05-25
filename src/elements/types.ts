export enum Pages {
  LogIn = 'Log in',
  SignUp = 'Sign up',
  Main = 'Main',
  Error404 = 'Error404',
  Catalog = 'Catalog',
  AboutUS = 'About us',
  Product = 'Product',
}

export enum AppEvents {
  switchPage = 'switchPage',
  updateUserName = 'updateUserName',
}

export interface Product {
  title: string;
  description: string;
  slug: string;
}
