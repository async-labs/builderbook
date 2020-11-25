import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/public';

export const getChapterDetailApiMethod = ({ bookSlug, chapterSlug }, options = {}) =>
  sendRequest(`${BASE_PATH}/get-chapter-detail?bookSlug=${bookSlug}&chapterSlug=${chapterSlug}`, {
    method: 'GET',
    ...options,
  });
