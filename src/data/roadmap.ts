/* DSA roadmap levels. Prerequisites are entry ids from entries.ts. */
import type { RoadmapLevel } from "./types";

export const ROADMAP: RoadmapLevel[] = [
  { level: 'Beginner', blurb: 'Core structures and the two basic searches. Learn these first.', steps: [
    { id: 'dynamic-array', needs: [] },
    { id: 'linear-search', needs: ['dynamic-array'] },
    { id: 'stack', needs: ['dynamic-array'] },
    { id: 'queue-deque', needs: ['dynamic-array'] },
    { id: 'hash-table', needs: ['dynamic-array'] },
    { id: 'frequency-counting', needs: ['hash-table'] },
    { id: 'two-pointers', needs: ['dynamic-array'] },
    { id: 'binary-search', needs: ['linear-search'] }
  ]},
  { level: 'Intermediate', blurb: 'Sorting, trees, graphs, and the patterns behind most interview questions.', steps: [
    { id: 'linked-list', needs: ['dynamic-array'] },
    { id: 'mergesort', needs: ['binary-search'] },
    { id: 'quicksort', needs: ['mergesort'] },
    { id: 'prefix-sums', needs: ['dynamic-array'] },
    { id: 'sliding-window', needs: ['two-pointers'] },
    { id: 'monotonic-stack', needs: ['stack'] },
    { id: 'bst', needs: ['binary-search', 'linked-list'] },
    { id: 'tree-traversal', needs: ['bst', 'stack'] },
    { id: 'binary-heap', needs: ['dynamic-array', 'bst'] },
    { id: 'graph-representations', needs: ['hash-table', 'dynamic-array'] },
    { id: 'bfs', needs: ['queue-deque', 'graph-representations'] },
    { id: 'dfs', needs: ['stack', 'graph-representations'] },
    { id: 'merge-intervals', needs: ['mergesort'] }
  ]},
  { level: 'Advanced', blurb: 'Weighted graphs, balanced structures, and problems that need a recurrence.', steps: [
    { id: 'heapsort', needs: ['binary-heap', 'mergesort'] },
    { id: 'counting-sort', needs: ['quicksort'] },
    { id: 'python-sort', needs: ['mergesort'] },
    { id: 'balanced-bst', needs: ['bst'] },
    { id: 'trie', needs: ['hash-table', 'tree-traversal'] },
    { id: 'union-find', needs: ['graph-representations'] },
    { id: 'dijkstra', needs: ['bfs', 'binary-heap'] },
    { id: 'bellman-ford', needs: ['dijkstra'] },
    { id: 'kruskal', needs: ['union-find', 'quicksort'] },
    { id: 'prim', needs: ['dijkstra'] },
    { id: 'backtracking', needs: ['dfs'] },
    { id: 'permutations', needs: ['backtracking'] },
    { id: 'dynamic-programming', needs: ['backtracking', 'hash-table'] }
  ]}
];
