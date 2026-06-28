import translate from 'google-translate-api-x';

async function run() {
  const res = await translate('The developers of this game invites you to sit behind the wheel of a large and fast planes.', {to: 'ar'});
  console.log("Translated:", res.text);
}
run();
