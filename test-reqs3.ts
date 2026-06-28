import * as cheerio from "cheerio";

async function run() {
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  const response = await fetch('https://an1.com/9560-animash-mod.html', { headers }); // Let's check a random app
  const html = await response.text();
  const $ = cheerio.load(html);
  $('.spec li').each((i, el) => {
     console.log("Spec:", $(el).text().replace(/\s+/g, ' ').trim());
  });
}
run();
