export default function GraphTree() {
  return (
    <>
      <h2 id="graph-tree">Graph and tree algorithms</h2>
      <p><code>V</code> is the number of vertices, <code>E</code> the number of edges, <code>n</code> the number of tree nodes, and <code>h</code> the tree height (about log n when balanced, up to n when skewed). Graph bounds assume an adjacency list unless noted.</p>

      <h3 id="traversal-search">Traversal and search</h3>
      <div className="table-wrap" role="region" aria-label="Traversal and search algorithms" tabIndex={0}>
      <table className="table">
      <caption>Time and auxiliary space for traversal, search, and tree operations.</caption>
      <tbody>
        <tr>
          <th scope="col">Algorithm</th>
          <th scope="col">Time</th>
          <th scope="col">Space</th>
          <th scope="col" className="notes">Notes</th>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Breadth-first_search">Breadth-first search (BFS)</a></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Uses a queue. Finds shortest paths by edge count. O(V<sup>2</sup>) with an adjacency matrix.</td>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Depth-first_search">Depth-first search (DFS)</a></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Uses recursion or an explicit stack, so depth can reach V. Basis for cycle detection and topological sort. O(V<sup>2</sup>) with an adjacency matrix.</td>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Binary_search">Binary search</a> on a sorted array</td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td><code className="green">O(1)</code> iterative, <code className="yellow-green">O(log n)</code> recursive</td>
          <td className="notes">Requires sorted, random-access data. Also works on any monotonic yes/no condition, not just arrays.</td>
        </tr>
        <tr>
          <td>Binary search tree lookup</td>
          <td><code className="yellow-green">O(h)</code></td>
          <td><code className="green">O(1)</code> iterative</td>
          <td className="notes">O(log n) when balanced, O(n) when skewed.</td>
        </tr>
        <tr>
          <td>Preorder, inorder, postorder traversal</td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="yellow-green">O(h)</code></td>
          <td className="notes">Recursion or stack depth is the height. Inorder on a binary search tree visits keys in sorted order.</td>
        </tr>
        <tr>
          <td>Level-order traversal</td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="yellow">O(w)</code></td>
          <td className="notes">Uses a queue; w is the widest level, which can be about n/2 in a complete tree.</td>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Tree_traversal#Morris_in-order_traversal_using_threading">Morris traversal</a></td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="green">O(1)</code></td>
          <td className="notes">Inorder or preorder with no stack. Temporarily rewires tree pointers, so it is not safe for concurrent readers.</td>
        </tr>
      </tbody></table>
      </div>

      <h3 id="heap-operations">Heap operations</h3>
      <p>For a binary heap holding n items.</p>
      <div className="table-wrap" role="region" aria-label="Binary heap operations" tabIndex={0}>
      <table className="table">
      <caption>Time and auxiliary space for common binary heap operations.</caption>
      <tbody>
        <tr>
          <th scope="col">Operation</th>
          <th scope="col">Time</th>
          <th scope="col" className="notes">Notes</th>
        </tr>
        <tr>
          <td>Peek min or max</td>
          <td><code className="green">O(1)</code></td>
          <td className="notes">Read the root.</td>
        </tr>
        <tr>
          <td>Insert</td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td className="notes">Append at the end, then sift up. O(1) on average for random data.</td>
        </tr>
        <tr>
          <td>Extract min or max</td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td className="notes">Swap the root with the last item, remove it, then sift down.</td>
        </tr>
        <tr>
          <td>Build heap from an array</td>
          <td><code className="yellow">O(n)</code></td>
          <td className="notes">Sift down from the last parent to the root. Faster than n separate inserts, which cost O(n log n).</td>
        </tr>
        <tr>
          <td>Change priority or delete at a known index</td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td className="notes">Finding the index without a position map costs O(n).</td>
        </tr>
        <tr>
          <td>Search for an arbitrary value</td>
          <td><code className="yellow">O(n)</code></td>
          <td className="notes">A heap only orders parents against children.</td>
        </tr>
        <tr>
          <td>Heapsort</td>
          <td><code className="orange">O(n log n)</code></td>
          <td className="notes">O(1) extra space. See the sorting table.</td>
        </tr>
      </tbody></table>
      </div>

      <h3 id="shortest-paths">Shortest-path algorithms</h3>
      <div className="table-wrap" role="region" aria-label="Shortest-path algorithms" tabIndex={0}>
      <table className="table">
      <caption>Time, space, and supported edge weights for common shortest-path algorithms.</caption>
      <tbody>
        <tr>
          <th scope="col">Algorithm</th>
          <th scope="col">Edge weights</th>
          <th scope="col">Time</th>
          <th scope="col">Space</th>
          <th scope="col" className="notes">Notes</th>
        </tr>
        <tr>
          <td>BFS</td>
          <td>Unweighted</td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Single source.</td>
        </tr>
        <tr>
          <td>0-1 BFS</td>
          <td>0 or 1 only</td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Single source. Uses a deque instead of a heap.</td>
        </tr>
        <tr>
          <td>Shortest path in a DAG</td>
          <td>Any, including negative</td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Single source. Relax edges in topological order.</td>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm">Dijkstra</a> with binary heap</td>
          <td>Non-negative</td>
          <td><code className="orange">O((V + E) log V)</code></td>
          <td><code className="yellow">O(V + E)</code>*</td>
          <td className="notes">Single source. The usual choice for sparse graphs.</td>
        </tr>
        <tr>
          <td>Dijkstra with array</td>
          <td>Non-negative</td>
          <td><code className="red">O(V<sup>2</sup>)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Single source. Beats the heap version on dense graphs.</td>
        </tr>
        <tr>
          <td>Dijkstra with Fibonacci heap</td>
          <td>Non-negative</td>
          <td><code className="orange">O(E + V log V)</code></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td className="notes">Single source. Best bound, rarely fastest in practice.</td>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm">Bellman–Ford</a></td>
          <td>Negative allowed</td>
          <td><code className="red">O(V·E)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Single source. Detects negative cycles reachable from the source.</td>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm">Floyd–Warshall</a></td>
          <td>Negative allowed, no negative cycles</td>
          <td><code className="red">O(V<sup>3</sup>)</code></td>
          <td><code className="red">O(V<sup>2</sup>)</code></td>
          <td className="notes">All pairs. Works on an adjacency matrix.</td>
        </tr>
      </tbody></table>
      </div>
      <ul className="footnotes">
        <li>* The space includes the adjacency list. A heap that allows duplicate entries instead of decrease-key can hold up to E items; an indexed heap with decrease-key needs only O(V) beyond the graph. The O((V + E) log V) bound assumes a standard adjacency-list implementation.</li>
        <li>Other space figures count extra space beyond the input graph.</li>
      </ul>

      <h3 id="minimum-spanning-trees">Minimum spanning trees</h3>
      <p>These algorithms take a connected, undirected, weighted graph. On a disconnected graph they produce a minimum spanning forest.</p>
      <div className="table-wrap" role="region" aria-label="Minimum spanning tree algorithms" tabIndex={0}>
      <table className="table">
      <caption>Time and space complexity of minimum spanning tree algorithms.</caption>
      <tbody>
        <tr>
          <th scope="col">Algorithm</th>
          <th scope="col">Time</th>
          <th scope="col">Space</th>
          <th scope="col" className="notes">Notes</th>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Kruskal%27s_algorithm">Kruskal</a></td>
          <td><code className="orange">O(E log E)</code></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td className="notes">Sort edges, then add each one that joins two components, using Union-Find. O(E log E) equals O(E log V) because E is at most V<sup>2</sup>. Works from an edge list.</td>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Prim%27s_algorithm">Prim</a> with binary heap</td>
          <td><code className="orange">O(E log V)</code></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td className="notes">Grows one tree from a start vertex. Good for sparse graphs.</td>
        </tr>
        <tr>
          <td>Prim with array</td>
          <td><code className="red">O(V<sup>2</sup>)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Good for dense graphs stored as a matrix.</td>
        </tr>
        <tr>
          <td>Prim with Fibonacci heap</td>
          <td><code className="orange">O(E + V log V)</code></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td className="notes">Best bound, rarely fastest in practice.</td>
        </tr>
        <tr>
          <td><a href="https://en.wikipedia.org/wiki/Bor%C5%AFvka%27s_algorithm">Borůvka</a></td>
          <td><code className="orange">O(E log V)</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td className="notes">Each round adds the cheapest edge leaving every component. Components at least halve each round, so it needs at most log V rounds. Easy to parallelize.</td>
        </tr>
      </tbody></table>
      </div>
    </>
  );
}
