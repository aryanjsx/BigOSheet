export default function GraphRepresentations() {
  return (
    <>
      <h2 id="graph-representations">Graph representations</h2>
      <p>A graph has <code>V</code> vertices and <code>E</code> edges. The representation you pick decides which operations are cheap. Here <code>deg(v)</code> is the number of edges at vertex <code>v</code>.</p>

      <div className="table-wrap" role="region" aria-label="Graph representations compared" tabIndex={0}>
      <table className="table">
      <caption>Operation costs and space use for adjacency lists, adjacency matrices, and edge lists.</caption>
      <tbody>
        <tr>
          <th scope="col">Operation</th>
          <th scope="col">Adjacency list</th>
          <th scope="col">Adjacency matrix</th>
          <th scope="col">Edge list</th>
        </tr>
        <tr>
          <td>Space</td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="red">O(V<sup>2</sup>)</code></td>
          <td><code className="yellow">O(E)</code></td>
        </tr>
        <tr>
          <td>Check whether edge (u, v) exists</td>
          <td><code className="yellow">O(deg(u))</code>*</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="yellow">O(E)</code></td>
        </tr>
        <tr>
          <td>Iterate neighbors of v</td>
          <td><code className="yellow">O(deg(v))</code></td>
          <td><code className="yellow">O(V)</code></td>
          <td><code className="yellow">O(E)</code></td>
        </tr>
        <tr>
          <td>Iterate all edges</td>
          <td><code className="yellow">O(V + E)</code></td>
          <td><code className="red">O(V<sup>2</sup>)</code></td>
          <td><code className="yellow">O(E)</code></td>
        </tr>
        <tr>
          <td>Add edge</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="green">O(1)</code></td>
          <td><code className="green">O(1)</code></td>
        </tr>
        <tr>
          <td>Remove edge</td>
          <td><code className="yellow">O(deg(u))</code>*</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="yellow">O(E)</code></td>
        </tr>
        <tr>
          <td>Add vertex</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="red">O(V<sup>2</sup>)</code>**</td>
          <td><code className="green">O(1)</code></td>
        </tr>
        <tr>
          <td>Best for</td>
          <td className="notes">Sparse graphs and traversals such as BFS, DFS, and Dijkstra.</td>
          <td className="notes">Dense graphs and algorithms that test many edges, such as Floyd–Warshall.</td>
          <td className="notes">Algorithms that sort or scan every edge, such as Kruskal and Bellman–Ford.</td>
        </tr>
      </tbody></table>
      </div>
      <ul className="footnotes">
        <li>* Storing each vertex&apos;s neighbors in a hash set makes edge lookup and removal O(1) on average, at the cost of more memory per vertex.</li>
        <li>** Growing a matrix means copying it. Preallocating capacity for the maximum number of vertices avoids the copy.</li>
        <li>For an undirected graph, adjacency lists and edge lists store each edge once or twice depending on the implementation; the asymptotic bounds are the same.</li>
      </ul>

      <h3>The same graph three ways</h3>
      <p>An undirected graph with four vertices and edges 0–1, 0–2, 1–3, and 2–3.</p>
      <div className="three-up">
        <div>
          <h4>Adjacency list</h4>
      <pre><code>{`0: [1, 2]
1: [0, 3]
2: [0, 3]
3: [1, 2]`}</code></pre>
        </div>
        <div>
          <h4>Adjacency matrix</h4>
      <pre><code>{`    0 1 2 3
0 [ 0 1 1 0 ]
1 [ 1 0 0 1 ]
2 [ 1 0 0 1 ]
3 [ 0 1 1 0 ]`}</code></pre>
        </div>
        <div>
          <h4>Edge list</h4>
      <pre><code>{`(0, 1)
(0, 2)
(1, 3)
(2, 3)`}</code></pre>
        </div>
      </div>
    </>
  );
}
