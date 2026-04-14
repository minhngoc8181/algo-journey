import { defineTests } from '../../_test-utils';
export default defineTests('reverse-string', (t, rng) => {
  t.visible('hello', { args: ['hello'], expected: 'olleh' });
  t.visible('ab', { args: ['ab'], expected: 'ba' });
  t.hidden('single', { args: ['a'], expected: 'a' });
  t.hidden('empty', { args: [''], expected: '' });
  t.hidden('palindrome', { args: ['abba'], expected: 'abba' });
  // 15 gen: total = 2+3+15 = 20 ✓
  for (let i = 0; i < 15; i++) {
    const len = rng.int(10, 500);
    const s = rng.string(len, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    t.hidden(`gen-${i}`, { args: [s], expected: [...s].reverse().join('') });
  }
});
