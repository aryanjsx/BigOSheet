/* Code complexity challenges: the same snippet in each language, plus the answers. */
import type { Challenge } from "./types";

export const CHALLENGES: Challenge[] = [
  { id: 'two-sum-hash', title: 'Two sum with a set', langs: {
      python: 'def two_sum(nums, target):\n    seen = set()\n    for x in nums:\n        if target - x in seen:\n            return True\n        seen.add(x)\n    return False',
      javascript: 'function twoSum(nums, target) {\n  const seen = new Set();\n  for (const x of nums) {\n    if (seen.has(target - x)) return true;\n    seen.add(x);\n  }\n  return false;\n}',
      java: 'static boolean twoSum(int[] nums, int target) {\n    Set<Integer> seen = new HashSet<>();\n    for (int x : nums) {\n        if (seen.contains(target - x)) return true;\n        seen.add(x);\n    }\n    return false;\n}' },
    time: 'O(n) expected', space: 'O(n)',
    timeOptions: ['O(1)', 'O(n) expected', 'O(n²)', 'O(n log n)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    why: 'One pass with expected O(1) hash operations. The set can hold up to n items, so auxiliary space is O(n).' },
  { id: 'reverse-in-place', title: 'Reverse in place', langs: {
      python: 'def reverse(a):\n    i, j = 0, len(a) - 1\n    while i < j:\n        a[i], a[j] = a[j], a[i]\n        i += 1\n        j -= 1',
      javascript: 'function reverse(a) {\n  let i = 0, j = a.length - 1;\n  while (i < j) {\n    [a[i], a[j]] = [a[j], a[i]];\n    i++; j--;\n  }\n}',
      java: 'static void reverse(int[] a) {\n    int i = 0, j = a.length - 1;\n    while (i < j) {\n        int t = a[i]; a[i] = a[j]; a[j] = t;\n        i++; j--;\n    }\n}' },
    time: 'O(n)', space: 'O(1)',
    timeOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    why: 'The pointers meet in the middle after n/2 swaps. Only two index variables and one temporary are used, so auxiliary space is constant.' },
  { id: 'reverse-copy', title: 'Reverse by slicing or copying', langs: {
      python: 'def reversed_copy(a):\n    return a[::-1]',
      javascript: 'function reversedCopy(a) {\n  return [...a].reverse();\n}',
      java: 'static int[] reversedCopy(int[] a) {\n    int[] out = new int[a.length];\n    for (int i = 0; i < a.length; i++) out[a.length - 1 - i] = a[i];\n    return out;\n}' },
    time: 'O(n)', space: 'O(n)',
    timeOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    why: 'Building the new list touches every element once. The result is a second list of n items, which counts as O(n) auxiliary space.' },
  { id: 'binary-recursive', title: 'Recursive binary search', langs: {
      python: 'def search(a, t, lo, hi):\n    if lo > hi:\n        return -1\n    mid = (lo + hi) // 2\n    if a[mid] == t:\n        return mid\n    if a[mid] < t:\n        return search(a, t, mid + 1, hi)\n    return search(a, t, lo, mid - 1)',
      javascript: 'function search(a, t, lo, hi) {\n  if (lo > hi) return -1;\n  const mid = Math.floor((lo + hi) / 2);\n  if (a[mid] === t) return mid;\n  if (a[mid] < t) return search(a, t, mid + 1, hi);\n  return search(a, t, lo, mid - 1);\n}',
      java: 'static int search(int[] a, int t, int lo, int hi) {\n    if (lo > hi) return -1;\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == t) return mid;\n    if (a[mid] < t) return search(a, t, mid + 1, hi);\n    return search(a, t, lo, mid - 1);\n}' },
    time: 'O(log n)', space: 'O(log n)',
    timeOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    why: 'Each call halves the range, giving about log₂ n calls. Each call adds a stack frame, so auxiliary space is O(log n). An iterative version would use O(1).' },
  { id: 'pairs', title: 'All pairs', langs: {
      python: 'def pairs(a):\n    out = []\n    for i in range(len(a)):\n        for j in range(i + 1, len(a)):\n            out.append((a[i], a[j]))\n    return out',
      javascript: 'function pairs(a) {\n  const out = [];\n  for (let i = 0; i < a.length; i++)\n    for (let j = i + 1; j < a.length; j++)\n      out.push([a[i], a[j]]);\n  return out;\n}',
      java: 'static List<int[]> pairs(int[] a) {\n    List<int[]> out = new ArrayList<>();\n    for (int i = 0; i < a.length; i++)\n        for (int j = i + 1; j < a.length; j++)\n            out.add(new int[]{a[i], a[j]});\n    return out;\n}' },
    time: 'O(n²)', space: 'O(n²)',
    timeOptions: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], spaceOptions: ['O(1)', 'O(n)', 'O(n²)', 'O(2ⁿ)'],
    why: 'There are n(n−1)/2 pairs, so the loops and the output list are both quadratic. If you only counted pairs instead of storing them, space would drop to O(1).' },
  { id: 'string-concat', title: 'Building a string in a loop', langs: {
      python: 'def build(parts):\n    s = ""\n    for p in parts:\n        s += p\n    return s',
      javascript: 'function build(parts) {\n  let s = "";\n  for (const p of parts) s += p;\n  return s;\n}',
      java: 'static String build(List<String> parts) {\n    String s = "";\n    for (String p : parts) s += p;\n    return s;\n}' },
    time: 'O(n²) worst case in Java; often O(n) in practice in JavaScript and CPython', space: 'O(n)',
    timeOptions: ['O(n) in every language', 'O(n²) worst case in Java; often O(n) in practice in JavaScript and CPython', 'O(log n)', 'O(1)'], spaceOptions: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    why: 'Java strings are immutable, so each += copies. Many JavaScript engines use ropes, and CPython can resize in place when it holds the only reference, but none of that is guaranteed. Use StringBuilder in Java and "".join in Python for a guaranteed O(n).' }
];
