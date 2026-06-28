import * as cheerio from "cheerio";

async function run() {
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  const response = await fetch('https://an1.com/3293-flight-pilot-simulator-3d-free-mod.html', { headers });
  const html = await response.text();
  const $ = cheerio.load(html);
  
  // Find images in the app details area
  console.log('App header images:');
  $('.app_header img').each((i, el) => console.log($(el).attr('src')));
  
  console.log('All images that might be icon:');
  $('img[itemprop="image"], .box_view img').each((i, el) => console.log($(el).attr('src')));
}
run();
