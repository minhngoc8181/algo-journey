/* ═══════════════════════════════════════════════════════════
   Exercise Registry — Full exercise definitions
   ═══════════════════════════════════════════════════════════ */

import type { Exercise } from '../shared/types';

export const exerciseRegistry: Record<string, Exercise> = {
  'first-index-of': {
    id: 'first-index-of',
    slug: 'first-index-of',
    version: 1,
    title: 'First Index Of',
    summary: 'Return the first index of target in the array.',
    topic: 'arrays',
    difficulty: 'easy',
    tags: ['linear-search'],
    estimatedMinutes: 10,
    order: 1,
    learningGoals: ['Iterate through an array', 'Use comparison to find a match'],
    mode: 'function_implementation',
    statement: 'Given an integer array `numbers` and a `target` value, return the first index where `target` appears. If it does not appear, return `-1`.',
    constraints: [
      'The array may be empty.',
      'If target appears multiple times, return the first index.',
    ],
    examples: [
      { input: 'numbers = [4, 2, 9, 2], target = 2', output: '1' },
      { input: 'numbers = [1, 3, 5], target = 4', output: '-1' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    int firstIndexOf(int[] numbers, int target) {
        // Write your code here
        return -1;
    }
}`,
      },
    ],
    requiredStructure: {
      className: 'Solution',
      methodName: 'firstIndexOf',
      signature: 'int firstIndexOf(int[] numbers, int target)',
    },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'example-1', args: [[4, 2, 9, 2], 2], expected: 1 },
        { name: 'example-2', args: [[1, 3, 5], 4], expected: -1 },
      ],
    },
  },

  'two-sum-basic': {
    id: 'two-sum-basic',
    slug: 'two-sum-basic',
    version: 1,
    title: 'Two Sum Basic',
    summary: 'Find two indices whose values add up to a target.',
    topic: 'arrays',
    difficulty: 'easy',
    tags: ['array-traversal', 'hash-map'],
    estimatedMinutes: 15,
    order: 2,
    learningGoals: ['Use nested loops or HashMap for lookup', 'Return indices'],
    mode: 'function_implementation',
    statement: 'Given an integer array `numbers` and a `target`, return the indices of two numbers that add up to the target. You may assume exactly one valid answer exists.',
    constraints: [
      'Return indices in any order.',
      'You may not use the same element twice.',
    ],
    examples: [
      { input: 'numbers = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'numbers[0] + numbers[1] = 9' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    int[] twoSum(int[] numbers, int target) {
        // Write your code here
        return new int[]{-1, -1};
    }
}`,
      },
    ],
    requiredStructure: {
      className: 'Solution',
      methodName: 'twoSum',
      signature: 'int[] twoSum(int[] numbers, int target)',
    },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'unordered_json',
      visibleTests: [
        { name: 'example-1', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      ],
    },
  },

  'reverse-array': {
    id: 'reverse-array',
    slug: 'reverse-array',
    version: 1,
    title: 'Reverse Array',
    summary: 'Reverse an integer array in place.',
    topic: 'arrays',
    difficulty: 'easy',
    tags: ['two-pointers'],
    estimatedMinutes: 10,
    order: 3,
    learningGoals: ['Use two pointers to swap elements', 'Modify array in place'],
    mode: 'function_implementation',
    statement: 'Given an integer array `arr`, reverse it in place and return the array.',
    constraints: ['Modify the original array.'],
    examples: [
      { input: 'arr = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    int[] reverseArray(int[] arr) {
        // Write your code here
        return arr;
    }
}`,
      },
    ],
    requiredStructure: {
      className: 'Solution',
      methodName: 'reverseArray',
      signature: 'int[] reverseArray(int[] arr)',
    },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'example-1', args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
        { name: 'example-2', args: [[10, 20]], expected: [20, 10] },
      ],
    },
  },

  'max-element': {
    id: 'max-element',
    slug: 'max-element',
    version: 1,
    title: 'Maximum Element',
    summary: 'Find the maximum element in an array.',
    topic: 'arrays',
    difficulty: 'easy',
    tags: ['array-traversal'],
    estimatedMinutes: 8,
    order: 4,
    learningGoals: ['Track running maximum while iterating'],
    mode: 'function_implementation',
    statement: 'Given an integer array `arr`, return the maximum element.',
    constraints: ['The array has at least one element.'],
    examples: [
      { input: 'arr = [3, 1, 4, 1, 5, 9]', output: '9' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    int maxElement(int[] arr) {
        // Write your code here
        return 0;
    }
}`,
      },
    ],
    requiredStructure: { className: 'Solution', methodName: 'maxElement', signature: 'int maxElement(int[] arr)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'example-1', args: [[3, 1, 4, 1, 5, 9]], expected: 9 },
        { name: 'example-2', args: [[-5, -2, -8]], expected: -2 },
      ],
    },
  },

  'count-occurrences': {
    id: 'count-occurrences',
    slug: 'count-occurrences',
    version: 1,
    title: 'Count Occurrences',
    summary: 'Count how many times a target appears in an array.',
    topic: 'arrays',
    difficulty: 'easy',
    tags: ['linear-search', 'counting'],
    estimatedMinutes: 10,
    order: 5,
    learningGoals: ['Count matching elements during iteration'],
    mode: 'function_implementation',
    statement: 'Given an integer array `arr` and a `target`, return the number of times `target` appears in `arr`.',
    constraints: [],
    examples: [
      { input: 'arr = [1, 2, 3, 2, 1], target = 2', output: '2' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    int countOccurrences(int[] arr, int target) {
        // Write your code here
        return 0;
    }
}`,
      },
    ],
    requiredStructure: { className: 'Solution', methodName: 'countOccurrences', signature: 'int countOccurrences(int[] arr, int target)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'example-1', args: [[1, 2, 3, 2, 1], 2], expected: 2 },
        { name: 'example-2', args: [[5, 5, 5], 5], expected: 3 },
      ],
    },
  },

  'is-palindrome': {
    id: 'is-palindrome',
    slug: 'is-palindrome',
    version: 1,
    title: 'Is Palindrome',
    summary: 'Check whether a given string is a palindrome.',
    topic: 'strings',
    difficulty: 'easy',
    tags: ['two-pointers', 'string-comparison'],
    estimatedMinutes: 12,
    order: 1,
    learningGoals: ['Compare characters from both ends'],
    mode: 'function_implementation',
    statement: 'Given a string `s`, return `true` if it reads the same forwards and backwards, `false` otherwise. Consider only lowercase letters.',
    constraints: ['The string contains only lowercase English letters.'],
    examples: [
      { input: 's = "racecar"', output: 'true' },
      { input: 's = "hello"', output: 'false' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }
}`,
      },
    ],
    requiredStructure: { className: 'Solution', methodName: 'isPalindrome', signature: 'boolean isPalindrome(String s)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'example-1', args: ['racecar'], expected: true },
        { name: 'example-2', args: ['hello'], expected: false },
      ],
    },
  },

  'fizz-buzz': {
    id: 'fizz-buzz',
    slug: 'fizz-buzz',
    version: 1,
    title: 'FizzBuzz',
    summary: 'Print numbers from 1 to n with Fizz/Buzz replacements.',
    topic: 'loops',
    difficulty: 'easy',
    tags: ['conditionals', 'modulo'],
    estimatedMinutes: 10,
    order: 1,
    learningGoals: ['Use loops with conditional logic', 'Handle multiple cases'],
    mode: 'function_implementation',
    statement: 'Given an integer `n`, return an array of strings where for each number from 1 to n: if divisible by 3 print "Fizz", if divisible by 5 print "Buzz", if divisible by both print "FizzBuzz", otherwise print the number as a string.',
    constraints: ['1 ≤ n ≤ 100'],
    examples: [
      { input: 'n = 5', output: '["1", "2", "Fizz", "4", "Buzz"]' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    String[] fizzBuzz(int n) {
        // Write your code here
        return new String[0];
    }
}`,
      },
    ],
    requiredStructure: { className: 'Solution', methodName: 'fizzBuzz', signature: 'String[] fizzBuzz(int n)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'example-1', args: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] },
        { name: 'example-2', args: [15], expected: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'] },
      ],
    },
  },

  'binary-search': {
    id: 'binary-search',
    slug: 'binary-search',
    version: 1,
    title: 'Binary Search',
    summary: 'Search for a target in a sorted array using binary search.',
    topic: 'searching',
    difficulty: 'medium',
    tags: ['divide-and-conquer'],
    estimatedMinutes: 20,
    order: 1,
    learningGoals: ['Implement binary search from scratch', 'Understand O(log n) time'],
    mode: 'function_implementation',
    statement: 'Given a sorted integer array `arr` and a `target`, return the index of `target` if found, otherwise return `-1`. Use binary search.',
    constraints: ['The array is sorted in ascending order.', 'All elements are distinct.'],
    examples: [
      { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 9', output: '4' },
      { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    int binarySearch(int[] arr, int target) {
        // Write your code here
        return -1;
    }
}`,
      },
    ],
    requiredStructure: { className: 'Solution', methodName: 'binarySearch', signature: 'int binarySearch(int[] arr, int target)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 15 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'example-1', args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
        { name: 'example-2', args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      ],
    },
  },

  'factorial': {
    id: 'factorial',
    slug: 'factorial',
    version: 1,
    title: 'Factorial',
    summary: 'Compute the factorial of a non-negative integer.',
    topic: 'recursion',
    difficulty: 'easy',
    tags: ['math'],
    estimatedMinutes: 10,
    order: 1,
    learningGoals: ['Base case and recursive case', 'Understand recursion depth'],
    mode: 'function_implementation',
    statement: 'Given a non-negative integer `n`, return `n!` (n factorial). By definition, `0! = 1`.',
    constraints: ['0 ≤ n ≤ 12'],
    examples: [
      { input: 'n = 5', output: '120' },
      { input: 'n = 0', output: '1' },
    ],
    editableFiles: [
      {
        path: 'Solution.java',
        role: 'main',
        starter: `class Solution {
    int factorial(int n) {
        // Write your code here
        return 0;
    }
}`,
      },
    ],
    requiredStructure: { className: 'Solution', methodName: 'factorial', signature: 'int factorial(int n)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'example-1', args: [5], expected: 120 },
        { name: 'example-2', args: [0], expected: 1 },
      ],
    },
  },

  'simple-counter': {
    id: 'simple-counter',
    slug: 'simple-counter',
    version: 1,
    title: 'Simple Counter',
    summary: 'Implement a counter class with increment and getValue.',
    topic: 'classes',
    difficulty: 'easy',
    tags: ['constructor', 'state'],
    estimatedMinutes: 15,
    order: 1,
    learningGoals: ['Use constructors', 'Manage object state'],
    mode: 'class_implementation',
    statement: 'Implement a class `Counter` with a constructor that takes a starting value, `increment()` that adds 1, and `getValue()` that returns the current value.',
    constraints: [],
    examples: [
      { input: 'Counter c = new Counter(5); c.increment(); c.getValue();', output: '6' },
    ],
    editableFiles: [
      {
        path: 'Counter.java',
        role: 'main',
        starter: `class Counter {
    Counter(int start) {
        // Write your code here
    }

    void increment() {
        // Write your code here
    }

    int getValue() {
        // Write your code here
        return -1;
    }
}`,
      },
    ],
    requiredStructure: {
      className: 'Counter',
      requiredMethods: ['Counter(int start)', 'void increment()', 'int getValue()'],
    },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'basic-sequence', operations: [['new', 5], ['increment'], ['getValue']], expected: 6 },
      ],
    },
  },

  // ── New exercises (M3 batch) ──

  'contains-duplicate': {
    id: 'contains-duplicate',
    slug: 'contains-duplicate',
    version: 1,
    title: 'Contains Duplicate',
    summary: 'Check if any value appears at least twice in the array.',
    topic: 'arrays',
    difficulty: 'easy',
    tags: ['hash-set'],
    estimatedMinutes: 10,
    order: 6,
    learningGoals: ['Use a HashSet for O(n) lookup', 'Detect duplicates'],
    mode: 'function_implementation',
    statement: 'Given an integer array `arr`, return `true` if any value appears at least twice, and `false` if every element is distinct.',
    constraints: ['1 ≤ arr.length ≤ 10000'],
    examples: [
      { input: 'arr = [1, 2, 3, 1]', output: 'true' },
      { input: 'arr = [1, 2, 3, 4]', output: 'false' },
    ],
    editableFiles: [{
      path: 'Solution.java',
      role: 'main',
      starter: `class Solution {
    boolean containsDuplicate(int[] arr) {
        // Write your code here
        return false;
    }
}`,
    }],
    requiredStructure: { className: 'Solution', methodName: 'containsDuplicate', signature: 'boolean containsDuplicate(int[] arr)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'has-dup', args: [[1, 2, 3, 1]], expected: true },
        { name: 'no-dup', args: [[1, 2, 3, 4]], expected: false },
      ],
    },
  },

  'merge-sorted-arrays': {
    id: 'merge-sorted-arrays',
    slug: 'merge-sorted-arrays',
    version: 1,
    title: 'Merge Sorted Arrays',
    summary: 'Merge two sorted arrays into a single sorted array.',
    topic: 'arrays',
    difficulty: 'medium',
    tags: ['two-pointers', 'merge'],
    estimatedMinutes: 20,
    order: 7,
    learningGoals: ['Two-pointer merge technique', 'Build result array'],
    mode: 'function_implementation',
    statement: 'Given two sorted integer arrays `a` and `b`, merge them into a single sorted array and return it.',
    constraints: ['Both arrays are sorted in ascending order.', 'Either array may be empty.'],
    examples: [
      { input: 'a = [1, 3, 5], b = [2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' },
      { input: 'a = [1], b = []', output: '[1]' },
    ],
    editableFiles: [{
      path: 'Solution.java',
      role: 'main',
      starter: `class Solution {
    int[] mergeSorted(int[] a, int[] b) {
        // Write your code here
        return new int[0];
    }
}`,
    }],
    requiredStructure: { className: 'Solution', methodName: 'mergeSorted', signature: 'int[] mergeSorted(int[] a, int[] b)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 15 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'merge-two', args: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
        { name: 'empty-b', args: [[1], []], expected: [1] },
      ],
    },
  },

  'power-of-two': {
    id: 'power-of-two',
    slug: 'power-of-two',
    version: 1,
    title: 'Power of Two',
    summary: 'Determine if a given integer is a power of two.',
    topic: 'math',
    difficulty: 'easy',
    tags: ['bit-manipulation'],
    estimatedMinutes: 8,
    order: 1,
    learningGoals: ['Use bit manipulation or repeated division', 'Handle edge cases (0, negative)'],
    mode: 'function_implementation',
    statement: 'Given an integer `n`, return `true` if it is a power of two, otherwise return `false`. A power of two is a number of the form 2^k where k ≥ 0.',
    constraints: ['-2^31 ≤ n ≤ 2^31 - 1'],
    examples: [
      { input: 'n = 16', output: 'true', explanation: '2^4 = 16' },
      { input: 'n = 6', output: 'false' },
      { input: 'n = 1', output: 'true', explanation: '2^0 = 1' },
    ],
    editableFiles: [{
      path: 'Solution.java',
      role: 'main',
      starter: `class Solution {
    boolean isPowerOfTwo(int n) {
        // Write your code here
        return false;
    }
}`,
    }],
    requiredStructure: { className: 'Solution', methodName: 'isPowerOfTwo', signature: 'boolean isPowerOfTwo(int n)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 3, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'is-16', args: [16], expected: true },
        { name: 'is-6', args: [6], expected: false },
        { name: 'is-1', args: [1], expected: true },
      ],
    },
  },

  'gcd': {
    id: 'gcd',
    slug: 'gcd',
    version: 1,
    title: 'Greatest Common Divisor',
    summary: 'Find the GCD of two positive integers using Euclidean algorithm.',
    topic: 'math',
    difficulty: 'easy',
    tags: ['euclidean'],
    estimatedMinutes: 12,
    order: 2,
    learningGoals: ['Implement Euclidean algorithm', 'Understand recursion vs iteration for GCD'],
    mode: 'function_implementation',
    statement: 'Given two positive integers `a` and `b`, return their greatest common divisor (GCD).',
    constraints: ['1 ≤ a, b ≤ 10^9'],
    examples: [
      { input: 'a = 12, b = 8', output: '4' },
      { input: 'a = 7, b = 13', output: '1', explanation: '7 and 13 are coprime' },
    ],
    editableFiles: [{
      path: 'Solution.java',
      role: 'main',
      starter: `class Solution {
    int gcd(int a, int b) {
        // Write your code here
        return 0;
    }
}`,
    }],
    requiredStructure: { className: 'Solution', methodName: 'gcd', signature: 'int gcd(int a, int b)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'gcd-12-8', args: [12, 8], expected: 4 },
        { name: 'coprime', args: [7, 13], expected: 1 },
      ],
    },
  },

  'selection-sort': {
    id: 'selection-sort',
    slug: 'selection-sort',
    version: 1,
    title: 'Selection Sort',
    summary: 'Sort an array using the selection sort algorithm.',
    topic: 'sorting',
    difficulty: 'medium',
    tags: ['comparison-sort'],
    estimatedMinutes: 20,
    order: 2,
    learningGoals: ['Find minimum in unsorted portion', 'Swap into correct position'],
    mode: 'function_implementation',
    statement: 'Given an integer array `arr`, sort it in ascending order using the selection sort algorithm and return the sorted array.',
    constraints: ['Use selection sort (find min, swap).'],
    examples: [
      { input: 'arr = [64, 25, 12, 22, 11]', output: '[11, 12, 22, 25, 64]' },
    ],
    editableFiles: [{
      path: 'Solution.java',
      role: 'main',
      starter: `class Solution {
    int[] selectionSort(int[] arr) {
        // Write your code here
        return arr;
    }
}`,
    }],
    requiredStructure: { className: 'Solution', methodName: 'selectionSort', signature: 'int[] selectionSort(int[] arr)' },
    limits: { timeLimitMs: 2000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'basic', args: [[64, 25, 12, 22, 11]], expected: [11, 12, 22, 25, 64] },
        { name: 'already-sorted', args: [[1, 2, 3]], expected: [1, 2, 3] },
      ],
    },
  },

  'count-vowels': {
    id: 'count-vowels',
    slug: 'count-vowels',
    version: 1,
    title: 'Count Vowels',
    summary: 'Count the number of vowels in a string.',
    topic: 'strings',
    difficulty: 'easy',
    tags: ['string-traversal'],
    estimatedMinutes: 8,
    order: 3,
    learningGoals: ['Iterate through characters', 'Check membership in a set'],
    mode: 'function_implementation',
    statement: 'Given a string `s`, return the number of vowels (a, e, i, o, u) in the string. Count both uppercase and lowercase vowels.',
    constraints: ['The string may contain any characters.'],
    examples: [
      { input: 's = "Hello World"', output: '3' },
      { input: 's = "aeiou"', output: '5' },
    ],
    editableFiles: [{
      path: 'Solution.java',
      role: 'main',
      starter: `class Solution {
    int countVowels(String s) {
        // Write your code here
        return 0;
    }
}`,
    }],
    requiredStructure: { className: 'Solution', methodName: 'countVowels', signature: 'int countVowels(String s)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'hello', args: ['Hello World'], expected: 3 },
        { name: 'all-vowels', args: ['aeiou'], expected: 5 },
      ],
    },
  },

  'hello-world': {
    id: 'hello-world',
    slug: 'hello-world',
    version: 1,
    title: 'Hello World',
    summary: 'Print "Hello, World!" to standard output.',
    topic: 'loops',
    difficulty: 'easy',
    tags: ['intro', 'output'],
    estimatedMinutes: 3,
    order: 0,
    learningGoals: ['Write a complete Java program', 'Use System.out.println'],
    mode: 'main_program',
    statement: 'Write a Java program that prints exactly `Hello, World!` to the standard output.',
    constraints: ['The output must be exactly "Hello, World!" (with the comma and exclamation mark).'],
    examples: [
      { input: '(no input)', output: 'Hello, World!' },
    ],
    editableFiles: [{
      path: 'Main.java',
      role: 'main',
      starter: `class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
    }],
    requiredStructure: { className: 'Main', methodName: 'main' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 1, maxHiddenTests: 0 },
    evaluation: {
      comparator: 'trimmed_text',
      visibleTests: [
        { name: 'output', expected: 'Hello, World!' },
      ],
    },
  },

  'sum-array': {
    id: 'sum-array',
    slug: 'sum-array',
    version: 1,
    title: 'Sum of Array',
    summary: 'Compute the sum of all elements in an integer array.',
    topic: 'arrays',
    difficulty: 'easy',
    tags: ['accumulator'],
    estimatedMinutes: 8,
    order: 0,
    learningGoals: ['Use an accumulator variable', 'Iterate through all elements'],
    mode: 'function_implementation',
    statement: 'Given an integer array `arr`, return the sum of all its elements.',
    constraints: ['The array may be empty (return 0).'],
    examples: [
      { input: 'arr = [1, 2, 3, 4, 5]', output: '15' },
      { input: 'arr = []', output: '0' },
    ],
    editableFiles: [{
      path: 'Solution.java',
      role: 'main',
      starter: `class Solution {
    int sumArray(int[] arr) {
        // Write your code here
        return 0;
    }
}`,
    }],
    requiredStructure: { className: 'Solution', methodName: 'sumArray', signature: 'int sumArray(int[] arr)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 2, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'basic', args: [[1, 2, 3, 4, 5]], expected: 15 },
        { name: 'empty', args: [[]], expected: 0 },
      ],
    },
  },

  'min-stack': {
    id: 'min-stack',
    slug: 'min-stack',
    version: 1,
    title: 'MinStack',
    summary: 'Design a stack that supports push, pop, and retrieving the minimum element.',
    topic: 'classes',
    difficulty: 'medium',
    tags: ['stack', 'design'],
    estimatedMinutes: 25,
    order: 2,
    learningGoals: ['Design a data structure with constraints', 'Use auxiliary storage for O(1) min'],
    mode: 'class_implementation',
    statement: 'Design a stack that supports `push(int val)`, `pop()`, `top()` (returns top element), and `getMin()` (returns minimum element). All operations should be O(1).',
    constraints: ['pop, top, and getMin are called on non-empty stacks.', 'Values can be negative.'],
    examples: [
      { input: 'MinStack s = new MinStack(); s.push(-2); s.push(0); s.push(-3); s.getMin();', output: '-3' },
    ],
    editableFiles: [{
      path: 'MinStack.java',
      role: 'main',
      starter: `class MinStack {
    MinStack() {
        // Write your code here
    }

    void push(int val) {
        // Write your code here
    }

    void pop() {
        // Write your code here
    }

    int top() {
        // Write your code here
        return 0;
    }

    int getMin() {
        // Write your code here
        return 0;
    }
}`,
    }],
    requiredStructure: {
      className: 'MinStack',
      requiredMethods: ['MinStack()', 'void push(int val)', 'void pop()', 'int top()', 'int getMin()'],
    },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 1, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'basic-ops', operations: [['new'], ['push', -2], ['push', 0], ['push', -3], ['getMin']], expected: -3 },
      ],
    },
  },

  'is-prime': {
    id: 'is-prime',
    slug: 'is-prime',
    version: 1,
    title: 'Is Prime',
    summary: 'Determine whether a given number is prime.',
    topic: 'math',
    difficulty: 'easy',
    tags: ['loop', 'optimization'],
    estimatedMinutes: 10,
    order: 3,
    learningGoals: ['Check divisibility up to sqrt(n)', 'Handle edge cases (0, 1, negative)'],
    mode: 'function_implementation',
    statement: 'Given an integer `n`, return `true` if `n` is a prime number, `false` otherwise. A prime is a natural number greater than 1 with no positive divisors other than 1 and itself.',
    constraints: ['n can be any integer.'],
    examples: [
      { input: 'n = 7', output: 'true' },
      { input: 'n = 4', output: 'false' },
      { input: 'n = 1', output: 'false' },
    ],
    editableFiles: [{
      path: 'Solution.java',
      role: 'main',
      starter: `class Solution {
    boolean isPrime(int n) {
        // Write your code here
        return false;
    }
}`,
    }],
    requiredStructure: { className: 'Solution', methodName: 'isPrime', signature: 'boolean isPrime(int n)' },
    limits: { timeLimitMs: 1000, outputLimitBytes: 32768, maxVisibleTests: 3, maxHiddenTests: 10 },
    evaluation: {
      comparator: 'exact_json',
      visibleTests: [
        { name: 'prime-7', args: [7], expected: true },
        { name: 'not-prime-4', args: [4], expected: false },
        { name: 'edge-1', args: [1], expected: false },
      ],
    },
  },
};
