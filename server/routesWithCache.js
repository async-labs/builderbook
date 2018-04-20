import LRUCache from 'lru-cache';

export default function routesWithCache({ server, app }) {
  const ssrCache = new LRUCache({
    max: 100, // 100 items
    maxAge: 1000 * 60 * 60, // 1hour
  });

  function getCacheKey(req) {
    return `${req.url}`;
  }

  async function renderAndCache(req, res, pagePath, queryParams) {
    const key = getCacheKey(req);

    // If we have a page in the cache, let's serve it
    if (ssrCache.has(key)) {
      res.setHeader('x-cache', 'HIT');
      res.send(ssrCache.get(key));
      return;
    }

    try {
      // If not let's render the page into HTML
      const html = await app.renderToHTML(req, res, pagePath, queryParams);

      // Something is wrong with the request, let's skip the cache
      if (res.statusCode !== 200) {
        res.send(html);
        return;
      }

      // Let's cache this page
      ssrCache.set(key, html);

      res.setHeader('x-cache', 'MISS');
      res.send(html);
    } catch (err) {
      app.renderError(err, req, res, pagePath, queryParams);
    }
  }

  // server.get('/books/:bookSlug/:chapterSlug', (req, res) => {
  //   const { bookSlug, chapterSlug } = req.params;
  //   renderAndCache(req, res, '/public/read-chapter', { bookSlug, chapterSlug });
  // });

  server.get('/', (req, res) => {
    renderAndCache(req, res, '/');
  });

  server.get('/book', (req, res) => {
    renderAndCache(req, res, '/book');
  });

  server.get('/book-reviews', (req, res) => {
    renderAndCache(req, res, '/book-reviews');
  });

  server.get('/tutorials', (req, res) => {
    renderAndCache(req, res, '/tutorials');
  });

  server.get('/login', (req, res) => {
    renderAndCache(req, res, '/public/login');
  });

  server.get('/terms', (req, res) => {
    renderAndCache(req, res, '/public/terms');
  });
}
