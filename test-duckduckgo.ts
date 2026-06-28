import * as cheerio from "cheerio";

async function run() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  const response = await fetch('https://html.duckduckgo.com/html/?q=site:9mod.com', { headers });
  const html = await response.text();
  const $ = cheerio.load(html);
  
  $('.result').each((_, el) => {
    const title = $(el).find('.result__title').text().trim();
    const link = $(el).find('.result__url').text().trim();
    const snippet = $(el).find('.result__snippet').text().trim();
    console.log(title, link);
  });
}
run();
