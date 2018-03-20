import 'isomorphic-fetch';

const port = process.env.PORT || 8000;
const dev = process.env.NODE_ENV !== 'production';
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://builderbook.org';

const BASE_PATH = '/api/v1/public';

async function sendRequest(path, options = {}) {
  const headers = Object.assign({}, options.headers || {}, {
    'Content-type': 'application/json; charset=UTF-8',
  });

  const response = await fetch(
    `${ROOT_URL}${path}`,
    Object.assign({ method: 'POST', credentials: 'include' }, options, { headers }),
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export const subscribeToNewsletter = ({ email }) =>
  sendRequest(`${BASE_PATH}/subscribe`, {
    body: JSON.stringify({ email }),
  });
