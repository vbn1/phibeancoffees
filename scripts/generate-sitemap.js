const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const growersPath = path.join(root, 'data', 'growers.json');
const sitemapPath = path.join(root, 'sitemap.xml');
const siteUrl = 'https://vbn1.github.io/phibeancoffees/';

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[character]);
}

async function main() {
  const growers = JSON.parse(await fs.readFile(growersPath, 'utf8'));
  if (!Array.isArray(growers)) {
    throw new Error('growers.json must contain an array of grower profiles.');
  }

  const urls = [
    siteUrl,
    `${siteUrl}privacy.html`,
    ...growers.map((grower) => {
      if (typeof grower.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(grower.slug)) {
        throw new Error('Every grower must have a valid slug before sitemap generation.');
      }
      return `${siteUrl}grower.html?slug=${encodeURIComponent(grower.slug)}`;
    })
  ];

  const entries = urls.map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  await fs.writeFile(sitemapPath, sitemap);
  console.log(`Generated sitemap with ${urls.length} URLs.`);
}

main().catch((error) => {
  console.error('Unable to generate sitemap:', error);
  process.exitCode = 1;
});
