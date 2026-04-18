import { defineTests } from '../../_test-utils';

export default defineTests('command-history', (t) => {
  t.visible('example-1', { 
    operations: [
      ['CommandHistory'],
      ['add', 5],
      ['getValue'],
      ['subtract', 2],
      ['getValue'],
      ['undo'],
      ['getValue'],
      ['undo'],
      ['getValue'],
      ['undo'],
      ['redo'],
      ['getValue'],
      ['add', 10],
      ['redo'],
      ['getValue']
    ],
    expected: [null, null, 5, null, 3, null, 5, null, 0, null, null, 5, null, null, 15] 
  });
});
