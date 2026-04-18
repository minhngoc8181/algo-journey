import { defineTests } from '../../_test-utils';

export default defineTests('moving-average', (t) => {
  t.visible('example-1', { 
    operations: [
      ['MovingAverage', 3],
      ['next', 1],
      ['next', 10],
      ['next', 3],
      ['next', 5]
    ],
    expected: [null, 1.0, 5.5, 4.666666666666667, 6.0] 
  });

  t.hidden('size-1', {
    operations: [
      ['MovingAverage', 1],
      ['next', 4],
      ['next', 0],
      ['next', -4]
    ],
    expected: [null, 4.0, 0.0, -4.0]
  });

  t.hidden('unfilled-buffer', {
    operations: [
      ['MovingAverage', 10],
      ['next', 5],
      ['next', 5],
      ['next', 5]
    ],
    expected: [null, 5.0, 5.0, 5.0]
  });
});
