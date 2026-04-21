import { defineTests } from '../../_test-utils';

export default defineTests('bt-is-balanced', (t) => {
  t.visible('balanced-example', { args: [[3, 9, 20, null, null, 15, 7]], expected: true });
  t.visible('unbalanced-deep',  { args: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false });
  t.visible('empty',            { args: [[]], expected: true });
  t.visible('single',           { args: [[1]], expected: true });

  t.hidden('two-nodes-l',       { args: [[1, 2, null]], expected: true });
  t.hidden('two-nodes-r',       { args: [[1, null, 2]], expected: true });
  t.hidden('three-balanced',    { args: [[1, 2, 3]], expected: true });
  t.hidden('chain-4-unbal',     { args: [[1, 2, null, 3, null, 4]], expected: false });
  t.hidden('perfect-4-bal',     { args: [[1, 2, 3, 4, 5, 6, 7]], expected: true });
  t.hidden('off-by-one-unbal',  { args: [[1, 2, 3, 4, null, null, null, 5]], expected: false });
});
