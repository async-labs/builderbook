const { SitemapStream, streamToPromise } = require('sitemap');
const path = require('path');
const zlib = require('zlib');
const Chapter = require('./models/Chapter');
const logger = require('./logger');
const getRootUrl = require('../lib/api/getRootUrl');

const ROOT_URL = getRootUrl();

function setupSitemapAndRobots({ server }) {
  let sitemap;

  server.get('/sitemap.xml', async (_, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    if (sitemap) {
      res.send(sitemap);
      return;
    }

    try {
      const smStream = new SitemapStream({
        hostname: ROOT_URL,
      });
      const gzip = zlib.createGzip();

      const chapters = Chapter.find({}, 'slug').sort({ order: 1 }).setOptions({ lean: true });

      if (chapters && chapters.length > 0) {
        // eslint-disable-next-line
        for (const chapter of chapters) {
          smStream.write({
            url: `/books/builder-book/${chapter.slug}`,
            changefreq: 'daily',
            priority: 1,
          });
        }
      }

      smStream.write({
        url: '/',
        changefreq: 'weekly',
        priority: 1,
      });

      smStream.write({
        url: '/login',
        changefreq: 'weekly',
        priority: 1,
      });

      streamToPromise(smStream.pipe(gzip)).then((sm) => (sitemap = sm)); // eslint-disable-line

      smStream.end();

      smStream
        .pipe(gzip)
        .pipe(res)
        .on('error', (err) => {
          throw err;
        });
    } catch (err) {
      logger.debug(err);
      res.status(500).end();
    }
  });

  server.get('/robots.txt', (_, res) => {
    res.sendFile(path.join(__dirname, '../public', 'robots.txt'));
  });
}

module.exports = setupSitemapAndRobots;
