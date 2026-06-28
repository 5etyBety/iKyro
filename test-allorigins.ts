async function run() {
  const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://9mod.com/roblox/');
  const response = await fetch(url);
  const text = await response.text();
  console.log(text.substring(0, 2000));
}
run();
