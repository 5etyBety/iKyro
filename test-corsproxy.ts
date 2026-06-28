async function run() {
  const response = await fetch('https://corsproxy.io/?https://9mod.com/');
  const html = await response.text();
  console.log(response.status);
  console.log(html.substring(0, 500));
}
run();
