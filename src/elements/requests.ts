const getProducts = async () => {
  const host = process.env.CTP_API_URL;
  const projectKey = process.env.CTP_PROJECT_KEY;
  const ctpAccessToken = process.env.CTP_ACCESS_TOKEN;

  try {
    const response = await fetch(`${host}/${projectKey}/products`, {
      headers: {
        Authorization: `Bearer ${ctpAccessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Нужно обновить токен');
      }
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Ошибка при выполнении GET-запроса: ${error}`);
  }
};

const getToken = async () => {
  const clientId = process.env.CTP_CLIENT_ID;
  const clientSecret = process.env.CTP_CLIENT_SECRET;
  const authUrl = process.env.CTP_AUTH_URL;
  const scope = process.env.scope;
  console.log(clientId, clientSecret, authUrl, scope);

  try {
    const response = await fetch(`${authUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      },
      body: `grant_type=client_credentials&scope=${scope}`,
    });

    if (!response.ok) {
      debugger;
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(`Ошибка при получении токена: ${error}`);
  }
};

export { getProducts, getToken };
