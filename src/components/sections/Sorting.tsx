export default function Sorting() {
  return (
    <>
      <div className="table-wrap" role="region" aria-label="Array sorting algorithms" tabIndex={0}>
      <table className="table">
      <caption>Best, average, and worst-case time and auxiliary space for common sorting algorithms.</caption>
      <thead>
      <tr><th scope="col" rowSpan={2}>Algorithm</th><th scope="colgroup" colSpan={3}>Time complexity</th><th scope="colgroup">Space complexity</th></tr>
      <tr><th scope="col">Best</th><th scope="col">Average</th><th scope="col">Worst</th><th scope="col">Auxiliary, worst</th></tr>
      </thead><tbody>
      <tr><td><a href="https://en.wikipedia.org/wiki/Quicksort">Quicksort</a><sup>a</sup></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="yellow-green">O(log n)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Merge_sort">Mergesort</a></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="yellow">O(n)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Timsort">Timsort</a></td><td><code className="yellow">&Theta;(n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="yellow">O(n)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Heapsort">Heapsort</a><sup>b</sup></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="green">O(1)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Bubble_sort">Bubble sort</a><sup>c</sup></td><td><code className="yellow">&Theta;(n)</code></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="green">O(1)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Insertion_sort">Insertion sort</a></td><td><code className="yellow">&Theta;(n)</code></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="green">O(1)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Selection_sort">Selection sort</a></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="green">O(1)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Tree_sort">Tree sort</a><sup>d</sup></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="red">&Theta;(n<sup>2</sup>)</code></td><td><code className="yellow">O(n)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Shellsort">Shell sort</a><sup>e</sup></td><td><code className="orange">&Omega;(n log n)</code></td><td><code className="gray">Depends on gaps</code></td><td><code className="red">O(n<sup>2</sup>)</code></td><td><code className="green">O(1)</code></td></tr>
      <tr><td><a rel="tooltip" title="k is the number of buckets. The average case assumes input spread roughly evenly across the buckets." href="https://en.wikipedia.org/wiki/Bucket_sort">Bucket sort</a><sup>f</sup></td><td><code className="green">&Theta;(n+k)</code></td><td><code className="green">&Theta;(n+k)</code></td><td><code className="red">O(n<sup>2</sup>)</code></td><td><code className="yellow">O(n+k)</code></td></tr>
      <tr><td><a rel="tooltip" title="k is the number of digits, treating the base b as a constant. Space is O(n + b)." href="https://en.wikipedia.org/wiki/Radix_sort">Radix sort</a></td><td><code className="green">&Theta;(nk)</code></td><td><code className="green">&Theta;(nk)</code></td><td><code className="green">&Theta;(nk)</code></td><td><code className="yellow">O(n+b)</code></td></tr>
      <tr><td><a rel="tooltip" title="k is the range of values (maximum minus minimum, plus one). Space covers the count array and the output array." href="https://en.wikipedia.org/wiki/Counting_sort">Counting sort</a></td><td><code className="green">&Theta;(n+k)</code></td><td><code className="green">&Theta;(n+k)</code></td><td><code className="green">&Theta;(n+k)</code></td><td><code className="yellow">O(n+k)</code></td></tr>
      <tr><td><a href="https://en.wikipedia.org/wiki/Cubesort">Cubesort</a></td><td><code className="yellow">&Omega;(n)</code></td><td><code className="orange">&Theta;(n log n)</code></td><td><code className="orange">O(n log n)</code></td><td><code className="yellow">O(n)</code></td></tr>
      </tbody></table>
      </div>

      <h2 id="sorting-notation">Notation in this table</h2>
      <ul>
        <li><code>Θ(f)</code> is a tight bound: the cost grows like <code>f</code> and no slower or faster. It is used wherever the bound is known to be tight.</li>
        <li><code>O(f)</code> is an upper bound and <code>Ω(f)</code> is a lower bound. They are used where only one side is established.</li>
        <li>Best, average, and worst name the input, not the bound type. Quicksort, for example, is Θ(n log n) in the best and average cases and Θ(n²) in the worst case.</li>
        <li>Space is auxiliary space beyond the input array.</li>
      </ul>
      <ol className="footnotes notes-list" type="a">
        <li><strong>Quicksort space.</strong> O(log n) when the recursion handles the smaller partition first. A naive implementation can need O(n) stack space in the worst case.</li>
        <li><strong>Heapsort.</strong> The Θ(n log n) best case holds for distinct keys. Input where every key is equal can finish in O(n).</li>
        <li><strong>Bubble sort.</strong> The Θ(n) best case needs an early exit when a pass makes no swaps. Without it, every case is Θ(n²).</li>
        <li><strong>Tree sort.</strong> Assumes inserting into a plain binary search tree, which degrades to Θ(n²) on already-sorted input. A self-balancing tree makes the worst case Θ(n log n).</li>
        <li><strong>Shell sort.</strong> The running time depends on the gap sequence. Shell&apos;s original gaps give O(n²) in the worst case; sequences such as Pratt&apos;s give O(n (log n)²). Average-case bounds are not known for most sequences.</li>
        <li><strong>Bucket sort.</strong> The Θ(n+k) average assumes input spread roughly evenly across buckets. If most items land in one bucket, the cost is dominated by sorting that bucket, up to O(n²).</li>
      </ol>
    </>
  );
}
