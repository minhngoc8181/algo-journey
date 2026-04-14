import { defineTests } from '../../_test-utils';
export default defineTests('is-palindrome', (t, rng) => {
  t.visible('racecar', { args: ['racecar'], expected: true });
  t.visible('hello', { args: ['hello'], expected: false });
  t.hidden('single-char', { args: ['a'], expected: true });
  t.hidden('empty', { args: [''], expected: true });
  t.hidden('two-same', { args: ['aa'], expected: true });
  t.hidden('two-diff', { args: ['ab'], expected: false });
  t.hidden('even-palindrome', { args: ['abba'], expected: true });
  t.hidden('almost', { args: ['abca'], expected: false });

  for (let i = 0; i < 12; i++) {
    const len = rng.int(5, 50);
    const halfStr = rng.string(len, 'abcdefghijklmnopqrstuvwxyz');
    if (rng.bool(0.5)) {
      const p = halfStr + [...halfStr].reverse().join('');
      t.hidden(`gen-${i}`, { args: [p], expected: true });
    } else {
      const p = halfStr + 'x' + [...halfStr].reverse().join('');
      t.hidden(`gen-${i}`, { args: [p + 'y'], expected: false });
    }
  }
});
