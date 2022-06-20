function getRootUrl() {
  const dev = process.env.NODE_ENV !== 'production';
  const ROOT_URL = dev
    ? process.env.NEXT_PUBLIC_URL_APP
    : process.env.NEXT_PUBLIC_PRODUCTION_URL_APP;

  return ROOT_URL;
}

module.exports = getRootUrl;
