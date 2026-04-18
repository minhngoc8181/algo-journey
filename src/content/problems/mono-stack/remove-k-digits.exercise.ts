import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'remove-k-digits',
  version: 1,
  title: 'Remove K Digits',
  summary: 'Remove k digits from a number string to make it as small as possible.',
  topic: 'mono-stack',
  difficulty: 'medium',
  tags: ['mono-stack', 'greedy', 'string', 'cse201'],
  estimatedMinutes: 30,
  order: 436,
  mode: 'function_implementation',
  hints: [
    'Think greedily from left to right: if the current digit is smaller than the previous digit, removing the previous digit makes the number smaller.',
    'Use a stack (or StringBuilder acting as a stack). For each digit, while `k > 0` and the stack top is **greater** than the current digit, pop the stack top (this counts as one removal).',
    'After processing all digits, if `k > 0` still, remove `k` digits from the end of the stack.',
    'Don\'t forget to handle leading zeros in the result. If the result is empty, return `"0"`.',
  ],

  learningGoals: ['Combine monotonic stack with greedy strategy', 'Handle string-based number manipulation and leading zeros'],
  statement: 'Given a non-negative integer represented as a string `num` and an integer `k`, remove exactly `k` digits from the number so that the resulting number is the **smallest possible**.\n\nReturn the result as a string. The result should not contain leading zeros (except for the number `"0"` itself).',
  constraints: ['`1 <= num.length <= 100000`', '`0 <= k <= num.length`', '`num` consists of digits `0-9` only and does not have leading zeros (except `num = "0"`).'],
  examples: [
    { input: 'num = "1432219", k = 3', output: '"1219"', explanation: 'Remove digits 4, 3, 2 to get the smallest number 1219.' },
    { input: 'num = "10200", k = 1', output: '"200"', explanation: 'Remove the leading 1 gives "0200", then strip leading zeros to get "200".' },
    { input: 'num = "10", k = 2', output: '"0"', explanation: 'Remove all digits, the result is "0".' },
  ],

  starter: {
    file: 'Solution.java',
    code: `class Solution {\n    String removeKDigits(String num, int k) {\n        // Write your code here\n        return "";\n    }\n}`,
  },

  requiredStructure: {
    className: 'Solution',
    methodName: 'removeKDigits',
    signature: 'String removeKDigits(String num, int k)',
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 5,
      seed: 20250474,
      namePrefix: 'stress-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 5; i++) {
            int len = (i >= 3) ? (50000 + rng.nextInt(50001)) : (1000 + rng.nextInt(4001));
            StringBuilder sb = new StringBuilder();
            sb.append((char)('1' + rng.nextInt(9))); // no leading zero
            for (int j = 1; j < len; j++) sb.append((char)('0' + rng.nextInt(10)));
            String num = sb.toString();
            int k = rng.nextInt(len / 2) + 1;
            // Reference: mono stack greedy
            StringBuilder stack = new StringBuilder();
            int rem = k;
            for (int j = 0; j < num.length(); j++) {
                char c = num.charAt(j);
                while (rem > 0 && stack.length() > 0 && stack.charAt(stack.length()-1) > c) {
                    stack.deleteCharAt(stack.length()-1);
                    rem--;
                }
                stack.append(c);
            }
            stack.setLength(stack.length() - rem);
            // Strip leading zeros
            int start = 0;
            while (start < stack.length() - 1 && stack.charAt(start) == '0') start++;
            String expected = stack.length() == 0 ? "0" : stack.substring(start);
            try {
                String actual = s.removeKDigits(num, k);
                boolean pass = expected.equals(actual);
                System.out.println("AJ|stress-" + i + "|" + pass + "|" + (actual==null?"null":actual.length()) + "|" + expected.length());
            } catch (Exception e) { System.out.println("AJ_ERROR|stress-" + i + ": " + e); }
        }`,
    },
  },
});
