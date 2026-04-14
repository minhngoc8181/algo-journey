async function main() {
  const r = await fetch('https://teavm.org/playground.html');
  const t = await r.text();
  console.log(t.substring(0, 2000));
}
main();
