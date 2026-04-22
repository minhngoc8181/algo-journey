import { defineTests } from '../../_test-utils';

export default defineTests('bt-height', (t) => {
  // Visible — core examples from problem statement (heights 0–3)
  t.visible('example-1',   { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 });
  t.visible('example-2',   { args: [[1, null, 2]], expected: 2 });
  t.visible('empty',       { args: [[]], expected: 0 });
  t.visible('single-node', { args: [[42]], expected: 1 });

  // Hidden — structural variety: heights 2–4
  t.hidden('two-right',    { args: [[1, null, 2]], expected: 2 });
  t.hidden('perfect-3',    { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 3 });
  t.hidden('perfect-4',    { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], expected: 4 });
  t.hidden('right-chain-3',{ args: [[1, null, 2, null, 3]], expected: 3 });
  t.hidden('unbalanced',   { args: [[1, 2, 3, 4, null, null, null, 5]], expected: 4 });
  t.hidden('two-level',    { args: [[1, 2, 3]], expected: 2 });

  // Hidden — deep chains: heights 5–8 (catches any hard-coded small-height logic)
  // Left-skewed chain: 5→4→3→2→1 (each node's left child only)
  t.hidden('left-chain-5', { args: [[5, 4, null, 3, null, 2, null, 1]], expected: 5 });
  // Right-skewed chain: 1→2→3→4→5→6
  t.hidden('right-chain-6',{ args: [[1, null, 2, null, 3, null, 4, null, 5, null, 6]], expected: 6 });
  // Left-skewed chain 7 levels: 7→6→5→4→3→2→1
  t.hidden('left-chain-7', { args: [[7, 6, null, 5, null, 4, null, 3, null, 2, null, 1]], expected: 7 });
  // Right-skewed chain 8 levels: 1→2→3→...→8
  t.hidden('right-chain-8',{ args: [[1, null, 2, null, 3, null, 4, null, 5, null, 6, null, 7, null, 8]], expected: 8 });
});
