export default function AlgorithmReference() {
  return (
    <>
      <h2 id="algorithms">Algorithm complexity</h2>
      <p>A quick reference for the searching, graph, heap, and interval algorithms that come up most in interviews. Detailed breakdowns follow in the next section.</p>

      <div className="table-wrap" role="region" aria-label="Algorithm complexity reference" tabIndex={0}>
      <table className="table">
      <caption>Time and space complexity of commonly asked search, graph, heap, and interval algorithms.</caption>
      <thead>
        <tr>
          <th scope="col">Algorithm</th>
          <th scope="col">Best</th>
          <th scope="col">Average</th>
          <th scope="col">Worst</th>
          <th scope="col">Space</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Linear search</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="green">O(1)</code></td>
        </tr>
        <tr>
          <td>Binary search</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td><code className="yellow-green">O(log n)</code>*</td>
          <td><code className="green">O(1)</code>*</td>
        </tr>
        <tr>
          <td>BFS</td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V)</code></td>
        </tr>
        <tr>
          <td>DFS</td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="yellow">O(V)</code>*</td>
        </tr>
        <tr>
          <td>Heap insert</td>
          <td><code className="gray">—</code></td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td><code className="green">O(1)</code> auxiliary</td>
        </tr>
        <tr>
          <td>Heap peek</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="green">O(1)</code></td>
          <td><code className="green">O(1)</code></td>
          <td><code className="green">O(1)</code></td>
        </tr>
        <tr>
          <td>Heap extract min or max</td>
          <td><code className="gray">—</code></td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td><code className="green">O(1)</code> auxiliary</td>
        </tr>
        <tr>
          <td>Merge intervals</td>
          <td><code className="gray">—</code></td>
          <td><code className="orange">O(n log n)</code></td>
          <td><code className="orange">O(n log n)</code></td>
          <td><code className="yellow">O(n)</code>*</td>
        </tr>
        <tr>
          <td>Union-Find operation</td>
          <td><code className="gray">—</code></td>
          <td><code className="green">Amortized O(α(n))</code></td>
          <td><code className="gray">—</code></td>
          <td><code className="yellow">O(n)</code> total structure</td>
        </tr>
        <tr>
          <td>Dijkstra with binary heap</td>
          <td><code className="gray">—</code></td>
          <td><code className="gray">—</code></td>
          <td><code className="orange">O((V + E) log V)</code>*</td>
          <td><code className="yellow">O(V + E)</code></td>
        </tr>
      </tbody></table>
      </div>
      <ul className="footnotes">
        <li>* Complexity depends on the implementation and assumptions. Binary search takes O(log n) time only on sorted random-access data; iterative binary search uses O(1) auxiliary space. BFS and DFS space depends on the graph representation and traversal implementation. Dijkstra&apos;s bound assumes a standard adjacency-list implementation with a binary heap.</li>
        <li>Heap insert is O(log n) as an upper bound. On random data the expected cost is O(1).</li>
        <li>Merge intervals is dominated by sorting the intervals; the O(n) space is the output list, plus any space the sort needs.</li>
        <li>Union-Find reaches amortized O(α(n)) only with path compression and union by rank or size. α is the inverse Ackermann function, which stays below 5 for any input that fits in memory.</li>
      </ul>
    </>
  );
}
