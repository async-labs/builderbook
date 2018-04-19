import 'isomorphic-unfetch';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://production-server.builderbook.org';

async function sendRequest(path, options = {}) {
  const headers = {
    'content-type': 'application/json; charset=UTF-8',
    // 'x-no-compression': 'on',
  };

  const response = await fetch(
    `${ROOT_URL}${path}`,
    Object.assign({ method: 'POST', credentials: 'include' }, { headers }, options),
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

export const getData = () =>
  sendRequest('/api/v1/public/get-data', {
    method: 'GET',
  });
