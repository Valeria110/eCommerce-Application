import { splitCountry } from '../pages/registration-page/layoutRegistrationPage';
import { splitStreetNameAndNumber } from '../pages/registration-page/validationInputsShippingAndBillingAddressForms';
import { AppEvents } from './types';
const LOCAL_STORAGE_CUSTOMER_TOKEN = 'customerToken';
const LOCAL_STORAGE_EMAIL = 'customerEmail';

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
      throw new Error('The variables .env is not defined correct. Check if exist this file.');
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

  private async authProjectToken() {
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
    this.updateUserEmail(email);

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
    }

    await this.updateUserData();

    return { isOk: response.ok, field, message };
  }

  authCustomersLogout() {
    this.customerToken = undefined;
    this.updateUserEmail(undefined);
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
      this.#customerData.firstName = customers.results[0].firstName;
      this.#customerData.lastName = customers.results[0].lastName;
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

  private async checkResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        console.error('We should update token');
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
            country: splitCountry(country),
            email: email,
          },
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
        Authorization: `Bearer ${this.projectToken}`,
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
        Authorization: `Bearer ${this.projectToken}`,
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
}

const requestsAPI = new RequestFetch();
export default requestsAPI;
