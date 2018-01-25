export default function getRootURL() {
  const port = process.env.PORT || 8000;
  const ROOT_URL =
    process.env.NODE_ENV === 'production' ? 'https://builderbook.org' : `http://localhost:${port}`;

  return ROOT_URL;
}
