import { defineTests } from '../../_test-utils';

export default defineTests('recent-counter', (t) => {
  t.visible('example-1', { 
    operations: [
      ['RecentCounter'],
      ['ping', 1],
      ['ping', 100],
      ['ping', 3001],
      ['ping', 3002]
    ],
    expected: [null, 1, 2, 3, 3] 
  });

  t.hidden('large-gaps', {
    operations: [
      ['RecentCounter'],
      ['ping', 10],
      ['ping', 4000],
      ['ping', 8000],
      ['ping', 8001]
    ],
    expected: [null, 1, 1, 1, 2]
  });

  t.hidden('bursts', {
    operations: [
      ['RecentCounter'],
      ['ping', 1],
      ['ping', 2],
      ['ping', 3],
      ['ping', 3002],
      ['ping', 3003]
    ],
    // At T=3002, requests are [1 (drops), 2, 3, 3002] -> size 3
    // At T=3003, requests are [2, 3, 3002, 3003] -> size 4 (actually wait)
    // T-3000 for T=3003 is 3. So [3, 3002, 3003] -> size 3
    expected: [null, 1, 2, 3, 3, 3]
  });
});
