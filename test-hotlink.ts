async function run() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'http://localhost:3000/'
  };
  const urls = [
    'https://cdn.5play.org/assets/main/mine-pic.webp',
    'https://5play.org/uploads/posts/2026-03/6105ba3c37_1.webp',
    'https://cdn.5play.org/posts/2024-09/1727330751_1.webp'
  ];
  for (const url of urls) {
     const res = await fetch(url, { headers });
     console.log(`${url}: ${res.status}`);
  }
}
run();
