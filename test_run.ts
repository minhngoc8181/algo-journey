import { javaRun } from './src/runner/java-runner.js';
import exercise from './src/content/problems/arrays/contains-duplicate.exercise.js';

const code = `class Solution {
    boolean containsDuplicate(int[] arr) {
        var total = 0;
        var n=1000000;
        for(var i = 0;i<n;i++){
            for(var j=0;j<n;j++){
                total += i*j;
            }
        }
        return true;
    }
}`;

async function main() {
  const result = await javaRun(exercise, code, true, 1000);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
