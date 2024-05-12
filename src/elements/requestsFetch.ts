class RequestFetch {
  base64Auth: string;

  CTP_CLIENT_ID: string;

  CTP_CLIENT_SECRET: string;

  authUrl: string;

  projectKey: string;

  constructor() {
    // TODO: Check env
    this.CTP_CLIENT_ID = process.env.CTP_CLIENT_ID ?? '';
    this.CTP_CLIENT_SECRET = process.env.CTP_CLIENT_SECRET ?? '';
    this.base64Auth = btoa(`${this.CTP_CLIENT_ID}:${this.CTP_CLIENT_SECRET}`);
    this.authUrl = process.env.CTP_AUTH_URL ?? '';
    this.projectKey = process.env.CTP_PROJECT_KEY ?? '';
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
    }

    console.log(obj);

    return response.ok;
  }

  async isExistCustomer(email: string) {
    const encodedEmail = encodeURIComponent(email);

    const url = `${this.authUrl}/${this.projectKey}/customers?where=email="${encodedEmail}"`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.base64Auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const customers = await response.json();

    // Если массив результатов не пуст, значит, клиент существует
    return customers.results.length > 0;
  }
}

const requestFetch = new RequestFetch();
export default requestFetch;
