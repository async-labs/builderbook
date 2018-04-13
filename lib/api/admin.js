import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/admin';

export const getBookList = () =>
  sendRequest(`${BASE_PATH}/books`, {
    method: 'GET',
  });

export const getBookDetail = ({ slug }) =>
  sendRequest(`${BASE_PATH}/books/detail/${slug}`, {
    method: 'GET',
  });

export const addBook = data =>
  sendRequest(`${BASE_PATH}/books/add`, {
    body: JSON.stringify(data),
  });

export const editBook = data =>
  sendRequest(`${BASE_PATH}/books/edit`, {
    body: JSON.stringify(data),
  });

export const syncOneChapter = ({ bookId, chapterId }) =>
  sendRequest(`${BASE_PATH}/books/sync-one-chapter`, {
    body: JSON.stringify({ bookId, chapterId }),
  });

export const syncAllChapters = ({ bookId }) =>
  sendRequest(`${BASE_PATH}/books/sync-all-chapters`, {
    body: JSON.stringify({ bookId }),
  });

export const getGithubRepos = () =>
  sendRequest(`${BASE_PATH}/github/repos`, {
    method: 'GET',
  });

export const getGithubRepoFiles = ({ repo }) =>
  sendRequest(`${BASE_PATH}/github/repo-files?repo=${encodeURI(repo)}`, {
    method: 'GET',
  });

export const searchUser = query =>
  sendRequest(`${BASE_PATH}/users/search`, {
    body: JSON.stringify({ query }),
  });

export const giveFreeBook = ({ userId, bookId }) =>
  sendRequest(`${BASE_PATH}/users/give-free-book`, {
    body: JSON.stringify({ userId, bookId }),
  });
