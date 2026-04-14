import { defineTests } from '../../_test-utils';
export default defineTests('count-vowels', (t, rng) => {
  t.visible('hello', { args: ['Hello World'], expected: 3 });
  t.visible('all-vowels', { args: ['aeiou'], expected: 5 });
  t.hidden('empty', { args: [''], expected: 0 });
  t.hidden('no-vowels', { args: ['bcdfg'], expected: 0 });
  t.hidden('uppercase', { args: ['AEIOU'], expected: 5 });
  t.hidden('mixed-case', { args: ['AeIoU'], expected: 5 });
  const vowelSet = new Set('aeiouAEIOU');
  for (let i = 0; i < 14; i++) {
    const len = rng.int(10, 500);
    const testStr = rng.string(len, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    t.hidden(`gen-${i}`, { args: [testStr], expected: [...testStr].filter(c => vowelSet.has(c)).length });
  }
});
