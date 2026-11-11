export default function MoreDataStructures() {
  return (
    <>
      <h2 id="more-data-structures">More data structures</h2>
      <p>These structures answer different questions than the table above, so each lists the operations it is actually used for. In the trie rows, <code>m</code> is the key length.</p>

      <div className="table-wrap" role="region" aria-label="Additional data structure operations" tabIndex={0}>
      <table className="table">
      <caption>Time and space costs for dynamic arrays, heaps, tries, Union-Find, stacks, and deques.</caption>
      <tbody>
        <tr>
          <th scope="col">Data structure</th>
          <th scope="col">Operation</th>
          <th scope="col">Time</th>
          <th scope="col">Space</th>
          <th scope="col" className="notes">Notes</th>
        </tr>

        <tr>
          <td className="group" rowSpan={5}><a href="https://en.wikipedia.org/wiki/Dynamic_array">Dynamic array</a></td>
          <td>Access by index</td><td><code className="green">O(1)</code></td>
          <td rowSpan={5}><code className="yellow">O(n)</code></td>
          <td className="notes" rowSpan={5}>Python <code>list</code>, Java <code>ArrayList</code>, C++ <code>vector</code>. Capacity grows geometrically, so most appends are cheap and an occasional append copies everything.</td>
        </tr>
        <tr><td>Append</td><td><code className="green">O(1)</code> amortized, <code className="yellow">O(n)</code> worst</td></tr>
        <tr><td>Insert or delete in the middle</td><td><code className="yellow">O(n)</code></td></tr>
        <tr><td>Remove last</td><td><code className="green">O(1)</code></td></tr>
        <tr><td>Search (unsorted)</td><td><code className="yellow">O(n)</code></td></tr>

        <tr>
          <td className="group" rowSpan={6}><a href="https://en.wikipedia.org/wiki/Binary_heap">Binary heap</a></td>
          <td>Peek min or max</td><td><code className="green">O(1)</code></td>
          <td rowSpan={6}><code className="yellow">O(n)</code></td>
          <td className="notes" rowSpan={6}>Stored in an array. Heaps give fast access to one extreme, not sorted order or fast search.</td>
        </tr>
        <tr><td>Insert</td><td><code className="yellow-green">O(log n)</code> worst, <code className="green">O(1)</code> average*</td></tr>
        <tr><td>Extract min or max</td><td><code className="yellow-green">O(log n)</code></td></tr>
        <tr><td>Build from n items</td><td><code className="yellow">O(n)</code></td></tr>
        <tr><td>Update or delete at a known position</td><td><code className="yellow-green">O(log n)</code></td></tr>
        <tr><td>Search for a value</td><td><code className="yellow">O(n)</code></td></tr>

        <tr>
          <td className="group" rowSpan={4}><a href="https://en.wikipedia.org/wiki/Trie">Trie</a></td>
          <td>Insert</td><td><code className="yellow">O(m)</code></td>
          <td rowSpan={4}><code className="yellow">O(n·m)</code> nodes</td>
          <td className="notes" rowSpan={4}>Cost depends on key length, not on how many keys are stored. Child arrays multiply space by the alphabet size; hash-map children save space.</td>
        </tr>
        <tr><td>Search</td><td><code className="yellow">O(m)</code></td></tr>
        <tr><td>Delete</td><td><code className="yellow">O(m)</code></td></tr>
        <tr><td>Find all keys with a prefix</td><td><code className="yellow">O(m + k)</code> for k results</td></tr>

        <tr>
          <td className="group" rowSpan={3}><a href="https://en.wikipedia.org/wiki/Disjoint-set_data_structure">Disjoint-set union (Union-Find)</a></td>
          <td>Make set</td><td><code className="green">O(1)</code></td>
          <td rowSpan={3}><code className="yellow">O(n)</code></td>
          <td className="notes" rowSpan={3}>With path compression and union by rank or size, find and union cost amortized O(α(n)), which is at most 4 for any practical n. Without both, a find can take O(n).</td>
        </tr>
        <tr><td>Find</td><td><code className="green">O(α(n))</code> amortized</td></tr>
        <tr><td>Union</td><td><code className="green">O(α(n))</code> amortized</td></tr>

        <tr>
          <td className="group" rowSpan={3}><a href="https://en.wikipedia.org/wiki/All_nearest_smaller_values">Monotonic stack</a></td>
          <td>Push or pop</td><td><code className="green">O(1)</code></td>
          <td rowSpan={3}><code className="yellow">O(n)</code></td>
          <td className="notes" rowSpan={3}>A stack that keeps its items in sorted order by popping anything that breaks the order. Each item is pushed and popped at most once, so problems like next greater element take O(n) in total, not O(n<sup>2</sup>).</td>
        </tr>
        <tr><td>Peek</td><td><code className="green">O(1)</code></td></tr>
        <tr><td>Process n items (whole pass)</td><td><code className="yellow">O(n)</code> amortized</td></tr>

        <tr>
          <td className="group" rowSpan={4}><a href="https://en.wikipedia.org/wiki/Double-ended_queue">Deque</a></td>
          <td>Push or pop at either end</td><td><code className="green">O(1)</code></td>
          <td rowSpan={4}><code className="yellow">O(n)</code></td>
          <td className="notes" rowSpan={4}>C++ <code>deque</code> supports O(1) indexing. Java <code>ArrayDeque</code> supports end operations but has no indexed-access API. Python <code>collections.deque</code> uses linked blocks, so indexing near the middle is O(n). A monotonic deque solves sliding-window maximum in O(n).</td>
        </tr>
        <tr><td>Peek either end</td><td><code className="green">O(1)</code></td></tr>
        <tr><td>Access by index</td><td><code className="green">O(1)</code> ring buffer, <code className="yellow">O(n)</code> linked blocks</td></tr>
        <tr><td>Search</td><td><code className="yellow">O(n)</code></td></tr>
      </tbody></table>
      </div>

      <h3 id="priority-queues">Priority queue implementations</h3>
      <p>A priority queue is an interface, not a single structure. The cost of each operation depends on what sits underneath.</p>
      <div className="table-wrap" role="region" aria-label="Priority queue implementations compared" tabIndex={0}>
      <table className="table">
      <caption>Peek, insert, extract, and decrease-key costs by priority queue implementation.</caption>
      <tbody>
        <tr>
          <th scope="col">Implementation</th>
          <th scope="col">Peek</th>
          <th scope="col">Insert</th>
          <th scope="col">Extract min or max</th>
          <th scope="col">Decrease key</th>
          <th scope="col" className="notes">Notes</th>
        </tr>
        <tr>
          <td>Unsorted array</td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="green">O(1)</code></td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="green">O(1)</code> at a known index</td>
          <td className="notes">Fine for small n or when extracts are rare.</td>
        </tr>
        <tr>
          <td>Sorted array</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="green">O(1)</code> from the sorted end</td>
          <td><code className="yellow">O(n)</code></td>
          <td className="notes">Fine when extracts far outnumber inserts.</td>
        </tr>
        <tr>
          <td>Binary heap</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td><code className="yellow-green">O(log n)</code></td>
          <td className="notes">The default choice. Python <code>heapq</code>, Java <code>PriorityQueue</code>, and C++ <code>priority_queue</code> use it. Most do not support decrease-key directly.</td>
        </tr>
        <tr>
          <td>Fibonacci heap</td>
          <td><code className="green">O(1)</code></td>
          <td><code className="green">O(1)</code> amortized</td>
          <td><code className="yellow-green">O(log n)</code> amortized</td>
          <td><code className="green">O(1)</code> amortized</td>
          <td className="notes">Best asymptotics for Dijkstra and Prim, but large constants make binary heaps faster in practice.</td>
        </tr>
      </tbody></table>
      </div>
      <ul className="footnotes">
        <li>* Inserting into a binary heap built from random data moves up a constant number of levels on average. The worst case is still O(log n).</li>
      </ul>
    </>
  );
}
