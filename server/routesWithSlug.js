function routesWithSlug({ server, app }) {
  server.get('/books/:bookSlug/:chapterSlug', (req, res) => {
    const { bookSlug, chapterSlug } = req.params;
    app.render(req, res, '/public/read-chapter', { bookSlug, chapterSlug });
  });

  server.get('/admin/edit-book/:slug', (req, res) => {
    const { slug } = req.params;
    app.render(req, res, '/admin/edit-book', { slug });
  });

  server.get('/admin/book-detail/:slug', (req, res) => {
    const { slug } = req.params;
    app.render(req, res, '/admin/book-detail', { slug });
  });

  server.get('/books/:slug', (req, res) => {
    res.redirect(`/books/${req.params.slug}/introduction`);
  });
}

module.exports = routesWithSlug;
