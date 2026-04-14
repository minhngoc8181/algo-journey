import { defineTests } from '../../_test-utils';

export default defineTests('find-cycle-length', (t, rng) => {
  // ── Visible Tests ──
  t.visible('small-cycle', { args: [[1, 2, 3, 4, 3]], expected: 2 });
  t.visible('cycle-with-tail', { args: [[1, 2, 3, 4, 5, 3]], expected: 3 });
  t.visible('entire-array', { args: [[1, 2, 3, 4, 1]], expected: 4 });
  t.visible('long-tail-short-cycle', { args: [[1, 2, 3, 4, 5, 6, 5]], expected: 2 });
  t.visible('medium-cycle', { args: [[1, 2, 3, 4, 5, 6, 7, 3]], expected: 5 });

  // ── Hidden Tests ──
  t.hidden('tail-100-cycle-100', { args: [generateGraph(100, 100)], expected: 100 });
  t.hidden('tail-500-cycle-50', { args: [generateGraph(500, 50)], expected: 50 });
  t.hidden('tail-10-cycle-1000', { args: [generateGraph(10, 1000)], expected: 1000 });
  t.hidden('self-loop-at-end', { args: [generateGraph(50, 1)], expected: 1 });
  t.hidden('entirely-loop-1000', { args: [generateGraph(0, 1000)], expected: 1000 });

  // ── Generated Tests ──
  for (let i = 0; i < 10; i++) {
    const tailLen = rng.int(0, 500);
    const cycleLen = rng.int(2, 500);
    const graph = generateGraph(tailLen, cycleLen);
    t.hidden(`gen-${i}`, { args: [graph], expected: cycleLen });
  }

  function generateGraph(tailLen: number, cycleLen: number): number[] {
    const arr: number[] = [];
    const totalNodes = tailLen + cycleLen;
    // Connect tail node i to i+1
    for (let i = 0; i < tailLen; i++) {
        arr.push(i + 1);
    }
    // Cycle starts at tailLen, connects to tailLen+1... up to totalNodes-1
    for (let i = tailLen; i < totalNodes - 1; i++) {
        arr.push(i + 1);
    }
    // Last node points back to the start of the cycle
    if (cycleLen > 0) {
        arr.push(tailLen);
    } else {
        // If somehow cycleLen is 0 handling (not used)
        if (arr.length > 0) {
            arr.push(arr.length - 1);
        }
    }
    return arr;
  }
});
