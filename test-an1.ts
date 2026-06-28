import * as cheerio from "cheerio";

async function run() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  const response = await fetch('https://an1.com/3293-flight-pilot-simulator-3d-free-mod.html', { headers });
  const html = await response.text();
  const $ = cheerio.load(html);
  
  $('ul[itemtype="https://schema.org/BreadcrumbList"] li').each((i, el) => {
    console.log("Breadcrumb:", $(el).text().trim());
  });
  
  $('a[itemprop="item"]').each((i, el) => {
    console.log("Item:", $(el).text().trim());
  });
}
run();
