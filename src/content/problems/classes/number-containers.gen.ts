import { defineTests } from '../../_test-utils';

export default defineTests('number-containers', (t) => {
  t.visible('example-1', { 
    operations: [
      ['NumberContainers'],
      ['find', 10],
      ['change', 2, 10],
      ['change', 1, 10],
      ['change', 3, 10],
      ['change', 5, 10],
      ['find', 10],
      ['change', 1, 20],
      ['find', 10]
    ],
    expected: [null, -1, null, null, null, null, 1, null, 2] 
  });

  t.hidden('replace', {
    operations: [
      ['NumberContainers'],
      ['change', 1, 10],
      ['change', 1, 20],
      ['find', 10],
      ['find', 20]
    ],
    expected: [null, null, null, -1, 1]
  });

  t.hidden('multiple-numbers', {
    operations: [
      ['NumberContainers'],
      ['change', 10, 100],
      ['change', 20, 100],
      ['change', 5, 200],
      ['find', 100],
      ['change', 10, 300],
      ['find', 100],
      ['find', 200]
    ],
    expected: [null, null, null, null, 10, null, 20, 5]
  });
});
