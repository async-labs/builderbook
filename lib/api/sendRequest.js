import 'isomorphic-unfetch';
import getRootUrl from './getRootUrl';

export default async function sendRequest(path, opts = {}) {
  const headers = Object.assign({}, opts.headers || {}, {
    'Content-type': 'application/json; charset=UTF-8',
  });

  const response = await fetch(
    `${getRootUrl()}${path}`,
    Object.assign({ method: 'POST', credentials: 'same-origin' }, opts, { headers }),
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
