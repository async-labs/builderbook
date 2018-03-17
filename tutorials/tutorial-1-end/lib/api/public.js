import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/public';

export const subscribeToTutorials = ({ email }) =>
  sendRequest(`${BASE_PATH}/subscribe`, {
    body: JSON.stringify({ email }),
  });
