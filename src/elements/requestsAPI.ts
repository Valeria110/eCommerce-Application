import { splitCountry } from '../pages/registration-page/layoutRegistrationPage';
import { splitStreetNameAndNumber } from '../pages/registration-page/validationInputsShippingAndBillingAddressForms';
import { reversedCountriesList } from '../utils/utils';
import cart from './cart';
import switchPage from './switchPage';
import { AppEvents, Product, IAddressObj, IUserData, Pages } from './types';
const LOCAL_STORAGE_CUSTOMER_TOKEN = 'customerToken';
const LOCAL_STORAGE_EMAIL = 'customerEmail';

interface Attribute {
  name: string;
  value: string;
}

function getAttributesValue(
  attributes: Attribute[],
  name: 'title' | 'author' | 'description' | 'year' | 'publishingHouse',
): string | null {
  for (const attribute of attributes) {
    if (attribute.name === name) {
      return attribute.value;
    }
  }
  return null; // возвращает null, если имя не найдено
}

class RequestFetch {
  base64Auth: string;

  projectClientID: string;

  projectClientSecret: string;

  authUrl: string;

  projectKey: string;

  host: string;

  scope: string;

  projectToken: string | undefined = '';

  #customerToken: string | undefined; // use only get set customerToken

  #customerData = {
    email: '',
    firstName: '',
    lastName: '',
    id: '',
    dateOfBirth: '',
    password: '',
  };

  #customerAddresses: {
    billingAddresses: IAddressObj[] | null;
    shippingAddresses: IAddressObj[] | null;
    defBillingAddress: IAddressObj | null;
    defShippingAddress: IAddressObj | null;
  } = {
    billingAddresses: null,
    shippingAddresses: null,
    defShippingAddress: null,
    defBillingAddress: null,
  };

  constructor() {
    this.authUrl = process.env.CTP_AUTH_URL ?? '';
    this.host = process.env.CTP_API_URL ?? '';

    this.projectClientID = process.env.CTP_CLIENT_ID ?? '';
    this.projectClientSecret = process.env.CTP_CLIENT_SECRET ?? '';
    this.projectKey = process.env.CTP_PROJECT_KEY ?? '';

    this.base64Auth = btoa(`${this.projectClientID}:${this.projectClientSecret}`);
    this.scope = `manage_project:${this.projectKey}`;

    const cacheCustomerToken = localStorage.getItem(LOCAL_STORAGE_CUSTOMER_TOKEN);
    this.customerToken = cacheCustomerToken ? cacheCustomerToken : undefined;
    this.#customerData.email = localStorage.getItem(LOCAL_STORAGE_EMAIL) ?? '';

    if (!(this.authUrl && this.host && this.projectClientID && this.projectClientSecret && this.projectKey)) {
      throw new Error('The variables .env is not defined correct. Check if this file exists.');
    }

    (async () => {
      await this.authProjectToken();
      if (this.#customerData.email) {
        await this.updateUserData();
      }
      document.body.dispatchEvent(new CustomEvent(AppEvents.updateUserName));
    })();
  }

  set customerToken(value: string | undefined) {
    this.#customerToken = value;
    if (value) {
      localStorage.setItem(LOCAL_STORAGE_CUSTOMER_TOKEN, value);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_CUSTOMER_TOKEN);
    }
  }

  get customerToken(): string | undefined {
    return this.#customerToken;
  }

  get isLogined() {
    return this.customerToken !== undefined;
  }

  get customerData() {
    return this.#customerData;
  }

  private updateUserEmail(email: string | undefined) {
    if (email) {
      this.#customerData.email = email;
      localStorage.setItem(LOCAL_STORAGE_EMAIL, email);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_EMAIL);
    }
  }

  async authProjectToken() {
    const response = await fetch(`${this.authUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.base64Auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&scope=${this.scope}`,
    });

    const obj = await response.json();
    if (!response.ok) {
      console.error(`Problem get project token! status: ${response.status}, message: ${obj.message}`);
    } else {
      this.projectToken = obj.access_token;
    }

    return response.ok;
  }

  async authCustomersLogin(
    email: string,
    password: string,
  ): Promise<{ isOk: boolean; field: 'login' | 'password' | undefined; message: string }> {
    const encodedEmail = encodeURIComponent(email);
    const encodedPassword = encodeURIComponent(password);

    const url = `${this.authUrl}/oauth/${this.projectKey}/customers/token?grant_type=password&username=${encodedEmail}&password=${encodedPassword}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.base64Auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const obj = await response.json();

    let field: 'login' | 'password' | undefined = undefined;
    let message = '';
    if (!response.ok) {
      if (obj.error === 'invalid_customer_account_credentials') {
        // Let's try to understand the user's problems
        if (await this.isExistCustomer(email)) {
          field = 'password';
          message = 'Wrong password. Try to remember it';
        } else {
          field = 'login';
          message = 'This user does not exist. Try to sign up';
        }
      } else {
        console.error(`HTTP error! status: ${response.status}, message: ${obj.message}`);
        field = 'login';
        message = 'Something wrong, please contact our support center';
      }
    } else {
      this.customerToken = obj.access_token;
      this.updateUserEmail(email);
      await this.updateUserData();
      document.body.dispatchEvent(new CustomEvent(AppEvents.updateUserName));
    }

    return { isOk: response.ok, field, message };
  }

  authCustomersLogout() {
    this.customerToken = undefined;
    this.updateUserEmail(undefined);
    localStorage.clear();
    cart.clearCacheWhenLogOut();
  }

  async isExistCustomer(email: string): Promise<boolean> {
    const whereEmailEqual = encodeURIComponent(`lowercaseEmail="${email.toLowerCase()}"`);

    const url = `${this.host}/${this.projectKey}/customers?where=${whereEmailEqual}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
      },
    });

    await this.checkResponse(response);

    const customers = await response.json();

    return customers.results.length > 0;
  }

  private async updateUserData() {
    if (!this.#customerData.email) {
      throw new Error('Cannot update user data, email is empty');
    }

    const whereEmailEqual = encodeURIComponent(`lowercaseEmail="${this.#customerData.email.toLowerCase()}"`);

    const url = `${this.host}/${this.projectKey}/customers?where=${whereEmailEqual}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
      },
    });

    await this.checkResponse(response);

    const customers = await response.json();

    if (customers.results) {
      this.#customerData.id = customers.results[0].id;
      this.#customerData.firstName = customers.results[0].firstName;
      this.#customerData.lastName = customers.results[0].lastName;
      this.#customerData.dateOfBirth = customers.results[0].dateOfBirth;

      localStorage.setItem(
        'shippingAddressIds',
        customers.results[0].shippingAddressIds.length ? JSON.stringify(customers.results[0].shippingAddressIds) : '',
      );
      localStorage.setItem(
        'billingAddressIds',
        customers.results[0].billingAddressIds.length ? JSON.stringify(customers.results[0].billingAddressIds) : '',
      );
      localStorage.setItem(
        'defaultBillingAddressId',
        customers.results[0].defaultBillingAddressId ? customers.results[0].defaultBillingAddressId : '',
      );
      localStorage.setItem(
        'defaultShippingAddressId',
        customers.results[0].defaultShippingAddressId ? customers.results[0].defaultShippingAddressId : '',
      );
      localStorage.setItem(
        'addresses',
        customers.results[0].addresses ? JSON.stringify(customers.results[0].addresses) : '',
      );

      localStorage.setItem('version', customers.results[0].version);
    } else {
      console.error('problem with request updateUserData');
    }
  }

  async getProducts() {
    const limit = 100;
    const url = `${this.host}/${this.projectKey}/products?limit=${limit}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await this.projectToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const resultProducts = await response.json();
      return resultProducts;
    } catch (error) {
      console.error('API error:', (error as Error).message);
    }
  }

  async getCategories() {
    try {
      const url = `${this.host}/${this.projectKey}/categories`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await this.projectToken}`,
          'Content-Type': 'application/json',
        },
      });
      const resultCategories = await response.json();
      return resultCategories;
    } catch (error) {
      console.error('API error:', (error as Error).message);
    }
  }

  async getCategory(id: string) {
    try {
      const limit = 100;
      const url = `${this.host}/${this.projectKey}/product-projections/search?filter=categories.id:${'"' + id + '"'}&limit=${limit}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await this.projectToken}`,
          'Content-Type': 'application/json',
        },
      });
      const resultCategories = await response.json();
      return resultCategories;
    } catch (error) {
      console.error('API error:', (error as Error).message);
    }
  }

  async sortNameAndPriceWithCategory(
    id: string,
    typeSort: string,
    isCategory: boolean,
    fromPrice = '',
    toPrice = '',
    search = '',
  ) {
    try {
      const limit = 100;
      let type;
      let url: string;
      if (typeSort === 'Alphabetically') {
        type = 'name.en-US asc';
      } else if (typeSort === 'Cheap') {
        type = 'price asc';
      } else if (typeSort === 'Expensive') {
        type = 'price desc';
      }

      if (isCategory === false && fromPrice === '' && toPrice === '' && search === '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?sort=${type}&limit=${limit}`;
      } else if (isCategory === true && fromPrice === '' && toPrice === '' && search === '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?filter=categories.id:${'"' + id + '"'}&sort=${type}&limit=${limit}`;
      } else if (isCategory === false && fromPrice === '' && toPrice === '' && search !== '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?text.en-US=${search}&fuzzy=true&sort=${type}&limit=${limit}`;
      } else if (isCategory === true && fromPrice === '' && toPrice === '' && search !== '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?filter=categories.id:${'"' + id + '"'}&text.en-US=${search}&fuzzy=true&sort=${type}&limit=${limit}`;
      } else if (isCategory === false && fromPrice !== '' && toPrice !== '' && search === '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&sort=${type}&limit=${limit}`;
      } else if (isCategory === true && fromPrice !== '' && toPrice !== '' && search === '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?filter=categories.id:${'"' + id + '"'}&filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&sort=${type}&limit=${limit}`;
      } else if (isCategory === false && fromPrice !== '' && toPrice !== '' && search !== '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?text.en-US=${search}&fuzzy=true&filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&sort=${type}&limit=${limit}`;
      } else {
        url = `${this.host}/${this.projectKey}/product-projections/search?filter=categories.id:${'"' + id + '"'}&text.en-US=${search}&fuzzy=true&filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&sort=${type}&limit=${limit}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await this.projectToken}`,
          'Content-Type': 'application/json',
        },
      });
      const resultCategories = await response.json();
      return resultCategories;
    } catch (error) {
      console.error('API error:', (error as Error).message);
    }
  }

  async getBookWithSearch(searchTerm: string, id: string, isCategory: boolean, fromPrice = '', toPrice = '') {
    try {
      let url;
      const limit = 100;
      if (isCategory === false && fromPrice === '' && toPrice === '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?text.en-US=${searchTerm}&fuzzy=true&limit=${limit}`;
      } else if (isCategory === true && fromPrice === '' && toPrice === '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?text.en-US=${searchTerm}&filter=categories.id:${'"' + id + '"'}&fuzzy=true&limit=${limit}`;
      } else if (isCategory === false && fromPrice !== '' && toPrice !== '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?text.en-US=${searchTerm}&filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&fuzzy=true&limit=${limit}`;
      } else {
        url = `${this.host}/${this.projectKey}/product-projections/search?text.en-US=${searchTerm}&filter=categories.id:${'"' + id + '"'}&filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&fuzzy=true&limit=${limit}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await this.projectToken}`,
          'Content-Type': 'application/json',
        },
      });
      const resultBooks = await response.json();
      return resultBooks;
    } catch (error) {
      console.error('API error:', (error as Error).message);
    }
  }

  async getBooksByPriceRange(fromPrice: string, toPrice: string, isCategory: boolean, id: string, search = '') {
    try {
      let url;
      const limit = 100;
      if (isCategory === false && search === '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&limit=${limit}`;
      } else if (isCategory === true && search === '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?filter=categories.id:${'"' + id + '"'}&filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&limit=${limit}`;
      } else if (isCategory === true && search !== '') {
        url = `${this.host}/${this.projectKey}/product-projections/search?text.en-US=${search}&filter=categories.id:${'"' + id + '"'}&filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&limit=${limit}`;
      } else {
        url = `${this.host}/${this.projectKey}/product-projections/search?text.en-US=${search}&filter=variants.price.centAmount:range (${fromPrice} to ${toPrice})&limit=${limit}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await this.projectToken}`,
          'Content-Type': 'application/json',
        },
      });
      const resultBooks = await response.json();
      return resultBooks;
    } catch (error) {
      console.error('API error:', (error as Error).message);
    }
  }

  async getProductsByID(productID: string): Promise<Product | undefined> {
    try {
      const response = await fetch(`${this.host}/${this.projectKey}/products/${productID}`, {
        headers: {
          Authorization: `Bearer ${this.isLogined ? this.#customerToken : this.projectToken}`,
        },
      });

      await this.checkResponse(response);

      if (!response.ok) {
        return undefined;
      }

      const obj = await response.json();
      const attributes = obj.masterData.current.masterVariant.attributes;
      const pricesRegular = obj.masterData.current.masterVariant.prices.at(0).value;
      const pricesDiscount = obj.masterData.current.masterVariant.prices.at(0).discounted;
      const img: {
        url: string;
        dimensions: {
          w: number;
          h: number;
        };
      }[] = obj.masterData.current.masterVariant.images;
      return {
        id: obj.id,
        title: obj.masterData.current.name['en-US'],
        description:
          obj.masterData.current.description?.['en-US'] ?? getAttributesValue(attributes, 'description') ?? '',
        slug: obj.masterData.current.slug['en-US'],
        author: getAttributesValue(attributes, 'author') ?? '',
        prices: {
          regular: pricesRegular.centAmount,
          discounted: pricesDiscount?.value?.centAmount,
        },
        images: img.map((item) => item.url),
      };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private async checkResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401 && this.isLogined) {
        console.error('User should login again');
        this.authCustomersLogout();
        switchPage(Pages.LogIn);
      } else {
        console.error(`Error HTTP: ${response.status}`);
      }
    }
  }

  async registerCustomer(email: string, firstName: string, lastName: string, password: string, dateOfBirth: string) {
    const url = `${this.host}/${this.projectKey}/me/signup`;
    const bodyRequest = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      dateOfBirth: dateOfBirth,
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    return response.json();
  }

  async addAddress(
    id: string,
    firstName: string,
    lastName: string,
    street: string,
    postalCode: string,
    city: string,
    country: string,
    email: string,
  ) {
    const streetObj = splitStreetNameAndNumber(street);
    const url = `${this.host}/${this.projectKey}/customers/${id}`;

    if (country.includes(' ')) {
      country = splitCountry(country);
    } else {
      country = reversedCountriesList[country];
    }

    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'addAddress',
          address: {
            title: 'My Address',
            firstName: firstName,
            lastName: lastName,
            streetName: streetObj.name,
            streetNumber: streetObj.number,
            postalCode: postalCode,
            city: city,
            country,
            email: email,
          },
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.isLogined ? this.#customerToken : this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    const newVersion = await response.json();
    localStorage.setItem('version', newVersion.version);
    return newVersion;
  }

  async setShippingAddress(idAddress: string, idCustomer: string) {
    const url = `${this.host}/${this.projectKey}/customers/${idCustomer}`;
    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'addShippingAddressId',
          addressId: idAddress,
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.isLogined ? this.#customerToken : this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    const newVersion = await response.json();
    localStorage.setItem('version', newVersion.version);
    return newVersion;
  }

  async setBillingAddress(idAddress: string, idCustomer: string) {
    const url = `${this.host}/${this.projectKey}/customers/${idCustomer}`;
    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'addBillingAddressId',
          addressId: idAddress,
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.isLogined ? this.#customerToken : this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    const newVersion = await response.json();
    localStorage.setItem('version', newVersion.version);
    return newVersion;
  }

  async setDefShippingAddress(idAddress: string, idCustomer: string) {
    const url = `${this.host}/${this.projectKey}/customers/${idCustomer}`;
    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'setDefaultShippingAddress',
          addressId: idAddress,
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    const newVersion = await response.json();
    localStorage.setItem('version', newVersion.version);
    return newVersion;
  }

  async setDefBillingAddress(idAddress: string, idCustomer: string) {
    const url = `${this.host}/${this.projectKey}/customers/${idCustomer}`;
    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'setDefaultBillingAddress',
          addressId: idAddress,
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    const newVersion = await response.json();
    localStorage.setItem('version', newVersion.version);
    return newVersion;
  }

  async getCustomerAddressData(id: string, num: number) {
    const url = `${this.host}/${this.projectKey}/customers/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.projectToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result.addresses[num].id;
  }

  private async setUserAddresses(): Promise<void> {
    const url = `${this.host}/${this.projectKey}/me?expand=addresses[*]`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.isLogined ? this.#customerToken : this.projectToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('version', data.version);
        const addresses = data.addresses;

        if (data.defaultBillingAddressId) {
          this.#customerAddresses.defBillingAddress = addresses.find(
            (address: IAddressObj) => address.id === data.defaultBillingAddressId,
          );
        } else {
          this.#customerAddresses.defBillingAddress = null;
        }

        if (data.defaultShippingAddressId) {
          this.#customerAddresses.defShippingAddress = addresses.find(
            (address: IAddressObj) => address.id === data.defaultShippingAddressId,
          );
        } else {
          this.#customerAddresses.defShippingAddress = null;
        }

        if (data.billingAddressIds.length > 0) {
          const billingAddresses: IAddressObj[] = [];

          data.billingAddressIds.forEach((billingAddressId: string) => {
            billingAddresses.push(addresses.find((address: IAddressObj) => address.id === billingAddressId));
          });

          this.#customerAddresses.billingAddresses = billingAddresses;
        } else {
          this.#customerAddresses.billingAddresses = null;
        }

        if (data.shippingAddressIds.length > 0) {
          const shippingAddresses: IAddressObj[] = [];

          data.shippingAddressIds.forEach((shippingAddressId: string) => {
            shippingAddresses.push(addresses.find((address: IAddressObj) => address.id === shippingAddressId));
          });

          this.#customerAddresses.shippingAddresses = shippingAddresses;
        } else {
          this.#customerAddresses.shippingAddresses = null;
        }
      } else {
        throw new Error('Failed to fetch user addresses');
      }
    } catch (error) {
      console.error(error);
    }
  }

  public getCustomerAddresses(): {
    billingAddresses: IAddressObj[] | null;
    shippingAddresses: IAddressObj[] | null;
    defBillingAddress: IAddressObj | null;
    defShippingAddress: IAddressObj | null;
  } {
    return this.#customerAddresses;
  }

  async getCustomer(): Promise<IUserData | null> {
    const url = `${this.host}/${this.projectKey}/customers`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.isLogined ? this.#customerToken : this.projectToken}`,
        },
      });

      this.checkResponse(response);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('version', data.version);
        const customer = data.results.find((userData: IUserData) => userData.id === this.#customerData.id);
        return customer;
      }

      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  private async updateUserVersion() {
    const url = `${this.host}/${this.projectKey}/customers/${this.customerData.id}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.isLogined ? this.#customerToken : this.projectToken}`,
        },
      });

      this.checkResponse(response);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('version', data.version);
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async updateUserFirstName(newName: string) {
    const url = `${this.host}/${this.projectKey}/customers/${this.#customerData.id}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: Number(localStorage.getItem('version')),
          actions: [{ action: 'setFirstName', firstName: `${newName}` }],
        }),
      });
      this.checkResponse(response);
      if (response.ok) {
        this.#customerData.firstName = newName;
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async updateUserLastName(newName: string) {
    const url = `${this.host}/${this.projectKey}/customers/${this.#customerData.id}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: Number(localStorage.getItem('version')),
          actions: [{ action: 'setLastName', lastName: `${newName}` }],
        }),
      });
      this.checkResponse(response);
      if (response.ok) {
        this.#customerData.lastName = newName;
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async changeUserEmail(newEmail: string) {
    const url = `${this.host}/${this.projectKey}/customers/${this.#customerData.id}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: Number(localStorage.getItem('version')),
          actions: [{ action: 'changeEmail', email: `${newEmail}` }],
        }),
      });
      this.checkResponse(response);
      if (response.ok) {
        this.#customerData.email = newEmail;
        localStorage.setItem(LOCAL_STORAGE_EMAIL, newEmail);
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async setDateOfBirth(dateOfBirth: string) {
    const url = `${this.host}/${this.projectKey}/customers/${this.#customerData.id}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: Number(localStorage.getItem('version')),
          actions: [{ action: 'setDateOfBirth', dateOfBirth: `${dateOfBirth}` }],
        }),
      });
      this.checkResponse(response);
      if (response.ok) {
        this.#customerData.dateOfBirth = dateOfBirth;
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async changePassword(currentPassword: string, newPassword: string) {
    const url = `${this.host}/${this.projectKey}/customers/password`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.customerData.id,
          version: Number(localStorage.getItem('version')),
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });
      this.checkResponse(response);
      if (response.ok) {
        this.#customerData.password = newPassword;
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async addNewAddress(street: string, postalCode: string, city: string, country: string) {
    const streetObj = splitStreetNameAndNumber(street);
    const url = `${this.host}/${this.projectKey}/customers/${this.#customerData.id}`;

    if (country.includes(' ')) {
      country = splitCountry(country);
    } else {
      country = reversedCountriesList[country];
    }

    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'addAddress',
          address: {
            title: 'My Address',
            firstName: this.#customerData.firstName,
            lastName: this.#customerData.lastName,
            streetName: streetObj.name,
            streetNumber: streetObj.number,
            postalCode: postalCode,
            city: city,
            country,
            email: this.#customerData.email,
          },
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.isLogined ? this.#customerToken : this.projectToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('version', data.version);
      const newAddressData: IAddressObj = data.addresses[data.addresses.length - 1];
      return newAddressData;
    }
  }

  async changeAddress(addressData: IAddressObj) {
    const url = `${this.host}/${this.projectKey}/customers/${this.customerData.id}`;
    const streetObj = splitStreetNameAndNumber(addressData.street);
    const countryName = addressData.country.includes(' ') ? addressData.country.split(' ')[0] : addressData.country;
    const countryAbbr = reversedCountriesList[countryName];
    await this.updateUserVersion();

    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'changeAddress',
          addressId: addressData.id,
          address: {
            title: 'My Address',
            streetName: streetObj.name,
            streetNumber: streetObj.number,
            postalCode: addressData.postalCode,
            city: addressData.city,
            country: countryAbbr,
          },
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyRequest),
      });

      this.checkResponse(response);
      if (response.ok) {
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async removeAddress(addAddressId: string) {
    const url = `${this.host}/${this.projectKey}/customers/${this.customerData.id}`;
    await this.updateUserVersion();

    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'removeAddress',
          addressId: addAddressId,
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyRequest),
      });

      this.checkResponse(response);
      if (response.ok) {
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async setDefaultShippingAddress(addAddressId: string) {
    const url = `${this.host}/${this.projectKey}/customers/${this.customerData.id}`;
    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'setDefaultShippingAddress',
          addressId: addAddressId,
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyRequest),
      });

      this.checkResponse(response);
      if (response.ok) {
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async setDefaultBillingAddress(addAddressId: string) {
    const url = `${this.host}/${this.projectKey}/customers/${this.customerData.id}`;
    await this.updateUserVersion();

    const bodyRequest = {
      version: Number(localStorage.getItem('version')),
      actions: [
        {
          action: 'setDefaultBillingAddress',
          addressId: addAddressId,
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.#customerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyRequest),
      });

      this.checkResponse(response);
      if (response.ok) {
        const data = await response.json();
        const newVersion = data.version;
        localStorage.setItem('version', newVersion);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

const requestsAPI = new RequestFetch();
export default requestsAPI;
