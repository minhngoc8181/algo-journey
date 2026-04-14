import { defineTests } from '../../_test-utils';
export default defineTests('simple-counter', (t, rng) => {
  t.visible('basic', { operations: [['new'], ['increment'], ['increment'], ['getValue']], expected: 2 });
  t.hidden('initial', { operations: [['new'], ['getValue']], expected: 0 });
  t.hidden('many', { operations: [['new'], ['increment'], ['increment'], ['increment'], ['increment'], ['increment'], ['getValue']], expected: 5 });

  // Generated – use seeded rng (was Math.random() before)
  for (let i = 0; i < 17; i++) {
    const ops: any[][] = [['new']];
    const numInc = rng.int(1, 100);
    for (let k = 0; k < numInc; k++) ops.push(['increment']);
    ops.push(['getValue']);
    t.hidden(`gen-${i}`, { operations: ops, expected: numInc });
  }
});
