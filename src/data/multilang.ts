/* Java, C++, and JavaScript versions of card snippets, keyed by entry id.
   Only for entries where the language difference is real and teachable. */
import type { MultiLang } from "./types";

export const MULTILANG: Record<string, MultiLang> = {
  'dynamic-array': {
    java: { code: 'List<Integer> items = new ArrayList<>();\nfor (int x = 0; x < n; x++) {\n    items.add(x);        // amortized O(1); occasional resize copies the array\n}\nitems.get(0);            // O(1)\nitems.add(0, -1);        // O(n): shifts every element right',
      cost: 'ArrayList grows by about 1.5×. Integer values are boxed, which adds memory and indirection. Use int[] when the size is fixed.' },
    cpp: { code: 'std::vector<int> items;\nfor (int x = 0; x < n; x++) {\n    items.push_back(x);       // amortized O(1); reallocation copies or moves elements\n}\nitems[0];                     // O(1)\nitems.insert(items.begin(), -1);  // O(n): shifts every element',
      cost: 'Growth is usually 1.5× or 2×, set by the implementation. Reserve capacity up front to avoid reallocations. Elements are stored contiguously, which is cache-friendly.' },
    javascript: { code: 'const items = [];\nfor (let x = 0; x < n; x++) {\n  items.push(x);       // amortized O(1)\n}\nitems[0];              // O(1)\nitems.unshift(-1);     // O(n) in general: engines may shift elements',
      cost: 'Arrays are engine-managed objects. Dense arrays behave like vectors, but holes or mixed types can switch the engine to slower representations.' }
  },
  'hash-table': {
    java: { code: 'Map<String, Integer> counts = new HashMap<>();\nfor (String w : words) {\n    counts.merge(w, 1, Integer::sum);   // O(1) expected\n}',
      cost: 'Since Java 8, HashMap turns long collision chains into balanced trees. If many keys share the same hash code, the tree keeps lookups at O(log n) only when the keys are Comparable; otherwise a lookup can still scan O(n) entries.' },
    cpp: { code: 'std::unordered_map<std::string, int> counts;\nfor (const auto& w : words) {\n    counts[w]++;          // O(1) expected; O(n) worst case\n}',
      cost: 'unordered_map is a hash table with O(n) worst-case operations. std::map is a balanced tree with O(log n) guaranteed and sorted order.' },
    javascript: { code: 'const counts = new Map();\nfor (const w of words) {\n  counts.set(w, (counts.get(w) ?? 0) + 1);   // O(1) expected\n}',
      cost: 'Map keeps insertion order and accepts any key type. Plain objects work but also carry prototype keys, so prefer Map for arbitrary keys.' }
  },
  'queue-deque': {
    java: { code: 'Deque<Integer> q = new ArrayDeque<>();\nq.addLast(1);          // O(1) amortized\nq.pollFirst();         // O(1)',
      cost: 'ArrayDeque is a circular buffer. LinkedList also works but uses more memory per element.' },
    cpp: { code: 'std::deque<int> q;\nq.push_back(1);        // O(1)\nq.pop_front();         // O(1)',
      cost: 'std::deque stores blocks of elements, giving O(1) at both ends. std::queue wraps a deque by default.' },
    javascript: { code: 'const q = [];\nq.push(1);             // O(1) amortized\nq.shift();             // can be O(n); engines vary',
      cost: 'Array.prototype.shift is not guaranteed O(1). For large queues, keep a head index or use a linked list.' }
  },
  'binary-heap': {
    java: { code: 'PriorityQueue<Integer> pq = new PriorityQueue<>();\npq.offer(5);           // O(log n)\npq.poll();             // O(log n)\npq.peek();             // O(1)',
      cost: 'Min-heap by default. remove(Object) is O(n), because it first has to find the element.' },
    cpp: { code: 'std::priority_queue<int, std::vector<int>, std::greater<int>> pq;\npq.push(5);            // O(log n)\npq.pop();              // O(log n)\npq.top();              // O(1)',
      cost: 'priority_queue is a max-heap by default. Pass std::greater for a min-heap. There is no decrease-key, so Dijkstra pushes duplicates.' },
    javascript: { code: '// No built-in heap. Use a library or write a small class.\nclass MinHeap {\n  constructor() { this.a = []; }\n  push(x) { this.a.push(x); this.#up(this.a.length - 1); }   // O(log n)\n  // pop and peek omitted for brevity\n  #up(i) {\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (this.a[p] <= this.a[i]) break;\n      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];\n      i = p;\n    }\n  }\n}',
      cost: 'JavaScript has no standard heap, so you write or import one. Interviews usually allow a short sketch.' }
  },
  'mergesort': {
    java: { code: 'Arrays.sort(objects);      // object arrays: stable merge-based sort (TimSort), O(n log n)\nArrays.sort(ints);         // int arrays: dual-pivot quicksort, O(n log n) typical, not stable',
      cost: 'Java chooses the algorithm by type. Objects need stability, so they use TimSort. Primitives have no identity, so stability is moot.' },
    cpp: { code: 'std::sort(v.begin(), v.end());          // O(n log n), not stable\nstd::stable_sort(v.begin(), v.end());   // O(n log n) with enough memory, stable',
      cost: 'std::sort is O(n log n) worst case (introsort). stable_sort may allocate a buffer.' },
    javascript: { code: 'arr.sort((a, b) => a - b);   // O(n log n), stable since ES2019',
      cost: 'Without a comparator, sort converts items to strings, so [10, 9, 1].sort() returns [1, 10, 9]. Always pass a comparator for numbers.' }
  },
  'binary-search': {
    java: { code: 'int mid = lo + (hi - lo) / 2;   // avoids int overflow\nint i = Arrays.binarySearch(sorted, target);   // O(log n)',
      cost: '(lo + hi) / 2 can overflow int for very large arrays. Use lo + (hi - lo) / 2.' },
    cpp: { code: 'int mid = lo + (hi - lo) / 2;\nauto it = std::lower_bound(v.begin(), v.end(), target);   // O(log n) on random-access iterators',
      cost: 'lower_bound is O(log n) comparisons, but on a std::list it is still O(n) iterator steps.' },
    javascript: { code: 'const mid = lo + ((hi - lo) >> 1);\n// No built-in binary search. Write it, or use a library.',
      cost: 'Numbers are doubles, so overflow is not a concern until about 2^53, but indexes above 2^31 break bitwise shifts.' }
  },
  'stack': {
    java: { code: 'Deque<Integer> st = new ArrayDeque<>();\nst.push(1);   // O(1)\nst.pop();     // O(1)',
      cost: 'Prefer ArrayDeque over the legacy Stack class, which is synchronized and slower.' },
    cpp: { code: 'std::stack<int> st;\nst.push(1);   // O(1)\nst.pop();     // O(1), returns void',
      cost: 'pop() does not return the value. Call top() first.' },
    javascript: { code: 'const st = [];\nst.push(1);   // O(1) amortized\nst.pop();     // O(1)',
      cost: 'A plain array is a fine stack.' }
  }
};
