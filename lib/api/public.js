import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/public';

export const getBookList = () =>
  sendRequest(`${BASE_PATH}/books`, {
    method: 'GET',
  });

export const getBookDetail = ({ slug }) =>
  sendRequest(`${BASE_PATH}/books/${slug}`, {
    method: 'GET',
  });

export const getChapterDetail = ({ bookSlug, chapterSlug }, options = {}) =>
  sendRequest(
    `${BASE_PATH}/get-chapter-detail?bookSlug=${bookSlug}&chapterSlug=${chapterSlug}`,
    Object.assign(
      {
        method: 'GET',
      },
      options,
    ),
  );

export const getTableOfContents = ({ slug }) =>
  sendRequest(`${BASE_PATH}/get-table-of-contents?slug=${slug}`, {
    method: 'GET',
  });

export const getTutorials = ({ slug }) =>
  sendRequest(`${BASE_PATH}/get-tutorials?slug=${slug}`, {
    method: 'GET',
  });

export const subscribeToTutorials = ({ email }) =>
  sendRequest(`${BASE_PATH}/subscribe-to-tutorials`, {
    body: JSON.stringify({ email }),
  });
