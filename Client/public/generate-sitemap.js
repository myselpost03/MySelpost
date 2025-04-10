const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const fs = require('fs');

(async () => {
  const sitemap = new SitemapStream({ hostname: 'https://yoursite.com' });

  const writeStream = createWriteStream('./public/sitemap.xml');
  sitemap.pipe(writeStream);

  const pages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about' },
    { url: '/contact' },
    // Add all your public routes here
  ];

  pages.forEach(page => sitemap.write(page));

  sitemap.end();
  await streamToPromise(sitemap);

  console.log('✅ Sitemap generated!');
})();
