function routesWithSlug({ server, app }) {
  server.get('/books/:bookSlug/:chapterSlug', (req, res) => {
    const { bookSlug, chapterSlug } = req.params;
    app.render(req, res, '/public/read-chapter', { bookSlug, chapterSlug, ...(req.query || {}) });
  });

  server.get('/admin/book-detail/:slug', (req, res) => {
    const { slug } = req.params;
    app.render(req, res, '/admin/book-detail', { slug });
  });

  server.get('/admin/edit-book/:slug', (req, res) => {
    const { slug } = req.params;
    app.render(req, res, '/admin/edit-book', { slug });
  });
}

module.exports = routesWithSlug;
