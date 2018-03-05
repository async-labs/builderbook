import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/customer';

export const buyBook = ({ id, stripeToken }) =>
  sendRequest(`${BASE_PATH}/buy-book`, {
    body: JSON.stringify({ id, stripeToken }),
  });

export const getMyBookList = (options = {}) =>
  sendRequest(
    `${BASE_PATH}/my-books`,
    Object.assign(
      {
        method: 'GET',
      },
      options,
    ),
  );
