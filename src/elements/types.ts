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
  updateCounterCart = 'updateCounterCart',
}

export interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  author: string;
  images: string[];
  prices: {
    regular: number;
    discounted: number | undefined;
  };
}

export interface InfoBook {
  id: string;
  masterData: {
    staged: {
      masterVariant: {
        attributes: { name: string; value: string }[];
        images: { url: string }[];
        prices: {
          value: { centAmount: number };
          discounted: { value: { centAmount: number } };
        }[];
      };
      name: {
        includes(value: string): unknown;
        'en-US': string;
        ru: string;
      };
    };
  };
}

export interface InfoBookCategory {
  masterVariant: {
    attributes: { name: string; value: string }[];
    images: { url: string }[];
    prices: {
      value: { centAmount: number };
      discounted: { value: { centAmount: number } };
    }[];
  };
  name: {
    'en-US': string;
    ru: string;
  };
  id: string;
}

export type Info<T> = T extends InfoBookCategory ? InfoBookCategory : InfoBook;

export interface IAddressObj {
  id: string;
  city: string;
  country: string;
  postalCode: string;
  street: string;
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
