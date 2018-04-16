import 'isomorphic-fetch';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://forked-process.builderbook.org';

async function sendRequest(path, options = {}) {
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
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

export const sendRequestToMainProcess = () =>
  sendRequest('/api/v1/public/main-process', {
    method: 'GET',
  });

export const sendRequestToForkedProcess = () =>
  sendRequest('/api/v1/public/forked-process', {
    method: 'GET',
  });
