class RequestFetch {
  base64Auth: string;

  projectClientID: string;

  projectClientSecret: string;

  authUrl: string;

  projectKey: string;

  host: string;

  scope: string;

  projectToken: string | undefined = '';

  accessToken: string | undefined = ''; // Bearer ${BEARER_TOKEN}

  constructor() {
    this.authUrl = process.env.CTP_AUTH_URL ?? '';
    this.host = process.env.CTP_API_URL ?? '';

    this.projectClientID = process.env.CTP_CLIENT_ID ?? '';
    this.projectClientSecret = process.env.CTP_CLIENT_SECRET ?? '';
    this.projectKey = process.env.CTP_PROJECT_KEY ?? '';
    this.base64Auth = btoa(`${this.projectClientID}:${this.projectClientSecret}`);

    this.scope = `manage_project:${this.projectKey}`;
    this.getNewProjectToken();
  }

  async getNewProjectToken() {
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

    console.log(obj);

    return response.ok;
  }

  async getCustomersToken(username: string, password: string) {
    // TODO: Обрабатывать когда можно войти а когда нет

    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);

    const url = `${this.authUrl}/oauth/${this.projectKey}/customers/token?grant_type=password&username=${encodedUsername}&password=${encodedPassword}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.base64Auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const obj = await response.json();
    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}, message: ${text.message}`);
      console.error(`HTTP error! status: ${response.status}, message: ${obj.message}`);
      if (obj.error === 'invalid_customer_account_credentials') {
        console.error('catch invalid_customer_account_credentials');
        // TODO: Проверить есть ли у нас такой пользователь или нет
      }
    } else {
      this.accessToken = obj.access_token;
    }

    console.log(obj);

    return response.ok;
  }

  async isExistCustomer(email: string) {
    const whereEmailEqual = encodeURIComponent(`lowercaseEmail="${email}"`);

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
    try {
      const response = await fetch(`${this.host}/${this.projectKey}/products`, {
        headers: {
          Authorization: `Bearer ${this.projectToken}`,
        },
      });

      await this.checkResponse(response);

      const obj = await response.json();
      console.log(obj.results);
      return response.ok;
    } catch (error) {
      console.error(`Ошибка при выполнении GET-запроса: ${error}`);
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
}

const requestFetch = new RequestFetch();
export default requestFetch;
