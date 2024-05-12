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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.json();
    console.log(text);

    return response.ok;
  }
}

const requestFetch = new RequestFetch();
export default requestFetch;
