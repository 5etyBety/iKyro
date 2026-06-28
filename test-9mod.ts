import * as cheerio from "cheerio";

async function run() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
  };
  const response = await fetch('https://9mod.com/games', { headers });
  const html = await response.text();
  console.log(response.status);
  console.log(html.substring(0, 500));
}
run();
