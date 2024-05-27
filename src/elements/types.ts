export enum Pages {
  LogIn = 'Log in',
  SignUp = 'Sign up',
  Main = 'Main',
  Error404 = 'Error404',
  Catalog = 'Catalog',
  AboutUS = 'About us',
  Product = 'Product',
  UserProfile = 'UserProfile',
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

export interface IAddressObj {
  id: string;
  city: string;
  country: string;
  postalCode: string;
  streetName: string;
  streetNumber: string;
}

export interface IUserData {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  addresses: {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: string;
    postalCode: string;
    city: string;
    country: string;
    email: string;
  }[];
  defaultShippingAddressId: string;
  defaultBillingAddressId: string;
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  stores: [];
  authenticationMode: string;
}
