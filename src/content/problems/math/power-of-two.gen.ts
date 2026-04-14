import { defineTests } from '../../_test-utils';
export default defineTests('power-of-two', (t) => {
  t.visible('16', { args: [16], expected: true }); t.visible('6', { args: [6], expected: false });
  t.hidden('large', { args: [1073741824], expected: true });
  for (let i = 0; i < 15; i++) {
    const n = Math.floor(Math.random() * 1000000);
    const isPowerOfTwo = n > 0 && (n & (n - 1)) === 0;
    t.hidden(`gen-${i}`, { args: [n], expected: isPowerOfTwo });
  }
});
