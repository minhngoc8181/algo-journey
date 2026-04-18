import { defineTests } from '../../_test-utils';

export default defineTests('remove-k-digits', (t) => {
  // ── Visible tests ──
  t.visible('example-1', { args: ['1432219', 3], expected: '1219' });
  t.visible('leading-zero', { args: ['10200', 1], expected: '200' });
  t.visible('remove-all', { args: ['10', 2], expected: '0' });
  t.visible('single-digit', { args: ['9', 1], expected: '0' });

  // ── Hidden tests ──
  t.hidden('no-removal', { args: ['12345', 0], expected: '12345' });
  t.hidden('descending', { args: ['54321', 2], expected: '321' });
  t.hidden('ascending', { args: ['12345', 2], expected: '123' });
  t.hidden('all-same', { args: ['1111', 2], expected: '11' });
  t.hidden('leading-zeros-result', { args: ['10001', 1], expected: '1' });
  t.hidden('remove-most', { args: ['123456', 5], expected: '1' });
});
