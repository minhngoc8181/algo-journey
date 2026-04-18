import { defineTests } from '../../_test-utils';

export default defineTests('ordered-stream', (t) => {
  t.visible('example-1', { 
    operations: [
      ['OrderedStream', 5],
      ['insert', 3, 'ccccc'],
      ['insert', 1, 'aaaaa'],
      ['insert', 2, 'bbbbb'],
      ['insert', 5, 'eeeee'],
      ['insert', 4, 'ddddd']
    ],
    expected: [null, [], ['aaaaa'], ['bbbbb', 'ccccc'], [], ['ddddd', 'eeeee']] 
  });

  t.hidden('in-order', {
    operations: [
      ['OrderedStream', 3],
      ['insert', 1, 'x'],
      ['insert', 2, 'y'],
      ['insert', 3, 'z']
    ],
    expected: [null, ['x'], ['y'], ['z']]
  });

  t.hidden('reversed-order', {
    operations: [
      ['OrderedStream', 3],
      ['insert', 3, 'c'],
      ['insert', 2, 'b'],
      ['insert', 1, 'a']
    ],
    expected: [null, [], [], ['a', 'b', 'c']]
  });
});
