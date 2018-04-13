import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/customer';

export const getMyBookList = () =>
  sendRequest(`${BASE_PATH}/my-books`, {
    method: 'GET',
  });

export const getMyBookmarksList = () =>
  sendRequest(`${BASE_PATH}/my-bookmarks`, {
    method: 'GET',
  });

export const buyBook = ({ id, stripeToken }) =>
  sendRequest(`${BASE_PATH}/buy-book`, {
    body: JSON.stringify({ id, stripeToken }),
  });

export const addBookmark = data =>
  sendRequest(`${BASE_PATH}/chapters/add-bookmark`, {
    body: JSON.stringify(data),
  });
