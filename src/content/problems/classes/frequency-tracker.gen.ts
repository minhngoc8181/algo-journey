import { defineTests } from '../../_test-utils';

export default defineTests('frequency-tracker', (t) => {
  t.visible('example-1', { 
    operations: [
      ['FrequencyTracker'],
      ['add', 3],
      ['add', 3],
      ['hasFrequency', 2],
      ['deleteOne', 3],
      ['hasFrequency', 2],
      ['hasFrequency', 1]
    ],
    expected: [null, null, null, true, null, false, true] 
  });

  t.hidden('delete-non-existent', {
    operations: [
      ['FrequencyTracker'],
      ['deleteOne', 5],
      ['hasFrequency', 0],
      ['hasFrequency', 1]
    ],
    expected: [null, null, false, false]
  });

  t.hidden('many-adds', {
    operations: [
      ['FrequencyTracker'],
      ['add', 10],
      ['add', 10],
      ['add', 10],
      ['hasFrequency', 3],
      ['deleteOne', 10],
      ['hasFrequency', 2]
    ],
    expected: [null, null, null, null, true, null, true]
  });
});
