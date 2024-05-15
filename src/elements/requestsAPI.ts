import { splitStreetNameAndNumber } from '../pages/registration-page/validationInputsShippingAndBillingAddressForms';

const LOCAL_STORAGE_CUSTOMER_TOKEN = 'customerToken';

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

  constructor() {
    this.authUrl = process.env.CTP_AUTH_URL ?? '';
    this.host = process.env.CTP_API_URL ?? '';

    this.projectClientID = process.env.CTP_CLIENT_ID ?? '';
    this.projectClientSecret = process.env.CTP_CLIENT_SECRET ?? '';
    this.projectKey = process.env.CTP_PROJECT_KEY ?? '';

    if (!(this.authUrl && this.host && this.projectClientID && this.projectClientSecret && this.projectKey)) {
      throw new Error('The variables .env is not defined correct. Check if exist this file.');
    }

    this.base64Auth = btoa(`${this.projectClientID}:${this.projectClientSecret}`);
    this.scope = `manage_project:${this.projectKey}`;
    this.authProjectToken();

    const cacheCustomerToken = localStorage.getItem(LOCAL_STORAGE_CUSTOMER_TOKEN);
    this.customerToken = cacheCustomerToken ? cacheCustomerToken : undefined;
  }

  set customerToken(value: string | undefined) {
    this.#customerToken = value;
    console.log(`set customerToken ${value}`);
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

    console.log(obj);

    return { isOk: response.ok, field, message };
  }

  authCustomersLogout() {
    this.customerToken = undefined;
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

  async getProducts() {
    // use customer token for this
    try {
      const response = await fetch(`${this.host}/${this.projectKey}/products`, {
        headers: {
          Authorization: `Bearer ${this.customerToken}`,
        },
      });

      await this.checkResponse(response);

      const obj = await response.json();
      console.log(obj.results);
      return response.ok;
    } catch (error) {
      return false;
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
      version: 1,
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
            country: country.split(' ')[country.split(' ').length - 1].replace('(', '').replace(')', ''),
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

    return response.json();
  }
}

const requestsAPI = new RequestFetch();
export default requestsAPI;
