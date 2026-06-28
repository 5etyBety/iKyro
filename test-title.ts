import * as cheerio from "cheerio";

async function run() {
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  const response = await fetch('https://an1.com/3293-flight-pilot-simulator-3d-free-mod.html', { headers });
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const titleRaw = $('h1').text().trim();
  const title1 = titleRaw.replace(/^Download\s+/i, '').replace(/\s+\b\d+(?:\.\d+)+\b.*$/i, '').trim();
  console.log("Regex:", title1);
  
  const cleanTitle = title1.replace(/\s*\(MOD.*?\)\s*/i, '').trim();
  console.log("Cleaned:", cleanTitle);
}
run();
