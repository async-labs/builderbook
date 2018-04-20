export default function routesWithSlug({ server, app }) {
  server.get('/non-cached', (req, res) => {
    app.render(req, res, '/non-cached');
  });
}
