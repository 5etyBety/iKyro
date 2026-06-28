import * as cheerio from "cheerio";
async function run() {
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  let r1 = await fetch("https://5play.org/en/11448-minecraft-mod.html", { headers });
  let $1 = cheerio.load(await r1.text());
  let votes = '';
  $1('span, div, li').each((_, el) => {
    const t = $1(el).text();
    if (t.includes('Votes:')) {
      votes = t.replace(/\s+/g, ' ').trim();
    }
  });
  console.log("VOTES:", votes);
}
run();
