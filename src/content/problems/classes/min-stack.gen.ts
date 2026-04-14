import { defineTests } from '../../_test-utils';
export default defineTests('min-stack', (t) => {
  t.visible('basic-ops', { operations: [['new'], ['push', -2], ['push', 0], ['push', -3], ['getMin']], expected: -3 });
  t.hidden('pop-and-min', { operations: [['new'], ['push', -2], ['push', 0], ['push', -3], ['getMin'], ['pop'], ['top'], ['getMin']], expected: [-3, 0, -2] });
  t.hidden('single', { operations: [['new'], ['push', 42], ['top'], ['getMin']], expected: [42, 42] });
  t.hidden('ascending', { operations: [['new'], ['push', 1], ['push', 2], ['push', 3], ['getMin']], expected: 1 });
  t.hidden('descending', { operations: [['new'], ['push', 3], ['push', 2], ['push', 1], ['getMin']], expected: 1 });
  
  for (let i = 0; i < 15; i++) {
    const ops: any[][] = [['new']];
    const expectedOut: number[] = [];
    const stack: number[] = [];
    const minStack: number[] = [];

    const numOps = Math.floor(Math.random() * 90) + 10;
    for (let k = 0; k < numOps; k++) {
      const p = Math.random();
      if (p < 0.5 || stack.length === 0) {
        const val = Math.floor(Math.random() * 2000) - 1000;
        ops.push(['push', val]);
        stack.push(val);
        if (minStack.length === 0 || val <= minStack[minStack.length - 1]!) {
          minStack.push(val);
        } else {
          minStack.push(minStack[minStack.length - 1]!);
        }
      } else if (p < 0.7) {
        ops.push(['pop']);
        stack.pop();
        minStack.pop();
      } else if (p < 0.85) {
        ops.push(['top']);
        expectedOut.push(stack[stack.length - 1]!);
      } else {
        ops.push(['getMin']);
        expectedOut.push(minStack[minStack.length - 1]!);
      }
    }
    t.hidden(`gen-${i}`, { operations: ops, expected: expectedOut.length === 1 ? expectedOut[0] : expectedOut });
  }
});
