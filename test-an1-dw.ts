import * as cheerio from "cheerio";

async function run() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  const response = await fetch('https://an1.com/file_3293-dw.html', { headers });
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const link = $('a.download_line, a#pre_download').attr('href');
  console.log("APK Link:", link);
}
run();
