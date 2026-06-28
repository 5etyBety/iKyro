import * as cheerio from "cheerio";

async function run() {
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  const response = await fetch('https://an1.com/', { headers });
  const html = await response.text();
  const $ = cheerio.load(html);
  $('.item').slice(0, 10).each((_, el) => {
    const titleRaw = $(el).find('.name span').text().trim() || $(el).find('.name').text().trim();
    console.log(titleRaw);
  });
}
run();
