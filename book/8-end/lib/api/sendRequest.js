import 'isomorphic-unfetch';
import getRootUrl from './getRootUrl';

export default async function sendRequest(path, options = {}) {
  const headers = { ...(options.headers || {}), 'Content-type': 'application/json; charset=UTF-8' };

  const response = await fetch(`${getRootUrl()}${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    ...options,
    headers,
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
