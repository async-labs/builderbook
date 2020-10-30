import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/admin';

export const getBookListApiMethod = () =>
  sendRequest(`${BASE_PATH}/books`, {
    method: 'GET',
  });

export const addBookApiMethod = ({ name, price, githubRepo }) =>
  sendRequest(`${BASE_PATH}/books/add`, {
    body: JSON.stringify({ name, price, githubRepo }),
  });

export const editBookApiMethod = ({
  id, name, price, githubRepo,
}) =>
  sendRequest(`${BASE_PATH}/books/edit`, {
    body: JSON.stringify({
      id,
      name,
      price,
      githubRepo,
    }),
  });

export const getBookDetailApiMethod = ({ slug }) =>
  sendRequest(`${BASE_PATH}/books/detail/${slug}`, {
    method: 'GET',
  });

