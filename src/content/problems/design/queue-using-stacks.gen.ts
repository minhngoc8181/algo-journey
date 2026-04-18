import { defineTests } from '../../_test-utils';

export default defineTests('queue-using-stacks', t => {
  t.visible('example-1', { 
    operations: [
      ['MyQueue'],
      ['push', 1],
      ['push', 2],
      ['peek'],
      ['pop'],
      ['empty']
    ],
    expected: [null, null, null, 1, 1, false] 
  });

  t.hidden('interleaved-ops', {
    operations: [
      ['MyQueue'],
      ['empty'],
      ['push', 10],
      ['empty'],
      ['peek'],
      ['push', 20],
      ['pop'],
      ['peek'],
      ['pop'],
      ['empty']
    ],
    expected: [null, true, null, false, 10, null, 10, 20, 20, true]
  });
});
