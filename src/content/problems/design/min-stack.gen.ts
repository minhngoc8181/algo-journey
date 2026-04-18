import { defineTests } from '../../_test-utils';

export default defineTests('min-stack', t => {
  t.visible('example-1', { 
    operations: [
      ['MinStack'],
      ['push', -2],
      ['push', 0],
      ['push', -3],
      ['getMin'],
      ['pop'],
      ['top'],
      ['getMin']
    ],
    expected: [null, null, null, null, -3, null, 0, -2] 
  });

  t.hidden('descending-stack', {
    operations: [
      ['MinStack'],
      ['push', 5],
      ['push', 4],
      ['push', 3],
      ['getMin'],
      ['pop'],
      ['getMin'],
      ['pop'],
      ['getMin']
    ],
    expected: [null, null, null, null, 3, null, 4, null, 5]
  });
});
