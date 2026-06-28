async function run() {
  const url = 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://9mod.com/');
  const response = await fetch(url);
  const text = await response.text();
  console.log(response.status);
  console.log(text.substring(0, 1000));
}
run();
