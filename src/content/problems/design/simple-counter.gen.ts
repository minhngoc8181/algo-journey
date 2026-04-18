import { defineTests } from '../../_test-utils';

export default defineTests('simple-counter', t => {
  t.visible('basic-sequence', { 
    operations: [
      ['Counter', 5],
      ['increment'],
      ['getValue']
    ],
    expected: [null, null, 6] 
  });

  t.hidden('multiple-increments', {
    operations: [
      ['Counter', 0],
      ['increment'],
      ['increment'],
      ['increment'],
      ['getValue']
    ],
    expected: [null, null, null, null, 3]
  });
});
