import { buildHarnessFiles } from './src/runner/harness-generator.js';
import * as fs from 'fs';

// Fake Exercise
const exercise = {
  requiredStructure: {
    className: 'Solution',
    methodName: 'containsDuplicate',
    signature: 'boolean containsDuplicate(int[] arr)'
  },
  evaluation: { comparator: 'exact_json' }
};

const tests = [
  { name: 't1', args: [[1, 2, 3, 1]], expected: true },
  { name: 't2', args: [[1, 2, 3, 4]], expected: false }
];

const harness = buildHarnessFiles(exercise, "class Solution { boolean containsDuplicate(int[] arr) { return true; } }", tests);
console.log(harness['RunnerMain.java']);
