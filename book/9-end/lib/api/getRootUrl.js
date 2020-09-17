function getRootUrl() {
  const dev = process.env.NODE_ENV !== 'production';
  const ROOT_URL = dev ? process.env.URL_APP : process.env.PRODUCTION_URL_APP;

  return ROOT_URL;
}

module.exports = getRootUrl;
