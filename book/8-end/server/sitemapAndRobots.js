// OLD VERSION

// const sm = require('sitemap');
// const path = require('path');
// const Chapter = require('./models/Chapter');

// const sitemap = sm.createSitemap({
//   hostname: 'https://builderbook.org',
//   cacheTime: 600000, // 600 sec - cache purge period
// });

// export default function setup({ server }) {
//   Chapter.find({}, 'slug').then((chapters) => {
//     chapters.forEach((chapter) => {
//       sitemap.add({
//         url: `/books/builder-book/${chapter.slug}`,
//         changefreq: 'daily',
//         priority: 1,
//       });
//     });
//   });

//   server.get('/sitemap.xml', (req, res) => {
//     sitemap.toXML((err, xml) => {
//       if (err) {
//         res.status(500).end();
//         return;
//       }

//       res.header('Content-Type', 'application/xml');
//       res.send(xml);
//     });
//   });

//   server.get('/robots.txt', (req, res) => {
//     res.sendFile(path.join(__dirname, '../static', 'robots.txt'));
//   });
// }

// module.exports = setup;

// NEW VERSION

const { SitemapStream, streamToPromise } = require('sitemap');
const path = require('path');
const zlib = require('zlib');
const Chapter = require('./models/Chapter');
const logger = require('./logger');

const dev = process.env.NODE_ENV !== 'production';

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
        hostname: dev ? process.env.URL_APP : process.env.PRODUCTION_URL_APP,
      });
      const gzip = zlib.createGzip();

      const chapters = Chapter.find({}, 'slug'); // check value

      // eslint-disable-next-line
      for (const chapter of chapters) {
        smStream.write({
          url: `/books/builder-book/${chapter.slug}`,
          changefreq: 'daily',
          priority: 1,
        });
      }

      smStream.write({
        url: '/',
        changefreq: 'weekly',
        priority: 0.9,
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
    res.sendFile(path.join(__dirname, '../static', 'robots.txt'));
  });
}

module.exports = setupSitemapAndRobots;
