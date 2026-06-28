async function run() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  const response = await fetch('https://9mod.com/feed', { headers });
  const html = await response.text();
  console.log(response.status);
  console.log(html.substring(0, 500));
}
run();
