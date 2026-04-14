import { defineTests } from '../../_test-utils';
export default defineTests('power-of-two', (t, rng) => {
  // Visible
  t.visible('16', { args: [16], expected: true });
  t.visible('6', { args: [6], expected: false });
  // Hidden – edge cases and deterministic examples
  t.hidden('1', { args: [1], expected: true });           // 2^0 = 1
  t.hidden('0', { args: [0], expected: false });           // 0 is NOT a power of 2
  t.hidden('negative', { args: [-4], expected: false });
  t.hidden('large-true', { args: [1073741824], expected: true });  // 2^30
  t.hidden('large-false', { args: [1073741825], expected: false });

  // Rule #6: alternate between true/false, use seeded rng (was Math.random() before)
  // Powers of 2 ≤ 2^20=1048576
  const powers = [1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576];
  for (let i = 0; i < 13; i++) {
    if (i % 2 === 0) {
      const p = powers[rng.int(0, powers.length - 1)]!;
      t.hidden(`gen-pow-${i}`, { args: [p], expected: true });
    } else {
      // Generate a non-power-of-two
      let n: number;
      do { n = rng.int(2, 1000000); } while ((n & (n - 1)) === 0);
      t.hidden(`gen-notpow-${i}`, { args: [n], expected: false });
    }
  }
});
