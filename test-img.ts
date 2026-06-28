import * as cheerio from "cheerio";

async function run() {
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  const response = await fetch('https://an1.com/3293-flight-pilot-simulator-3d-free-mod.html', { headers });
  const html = await response.text();
  const $ = cheerio.load(html);
  console.log('img:', $('.img_box img').attr('src'));
  console.log('og:', $('meta[property="og:image"]').attr('content'));
}
run();
