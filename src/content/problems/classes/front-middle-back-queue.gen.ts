import { defineTests } from '../../_test-utils';

export default defineTests('front-middle-back-queue', (t) => {
  t.visible('example-1', { 
    operations: [
      ['FrontMiddleBackQueue'],
      ['pushFront', 1],
      ['pushBack', 2],
      ['pushMiddle', 3],
      ['pushMiddle', 4],
      ['popFront'],
      ['popMiddle'],
      ['popMiddle'],
      ['popBack'],
      ['popFront']
    ],
    expected: [null, null, null, null, null, 1, 3, 4, 2, -1] 
  });

  t.hidden('empty-pops', {
    operations: [
      ['FrontMiddleBackQueue'],
      ['popFront'],
      ['popMiddle'],
      ['popBack']
    ],
    expected: [null, -1, -1, -1]
  });

  t.hidden('alternating', {
    operations: [
      ['FrontMiddleBackQueue'],
      ['pushBack', 10],
      ['pushFront', 20],
      ['pushMiddle', 30],
      ['popBack'],
      ['popFront']
    ],
    expected: [null, null, null, null, 10, 20]
  });
});
