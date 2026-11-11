export default function CodingPatterns() {
  return (
    <>

      <div className="callout" role="note">
        <p><strong>These are typical complexities, not guarantees.</strong> The real cost depends on the problem, on how you implement the pattern, and on any extra work such as sorting the input first. Always check the bound against your own code.</p>
      </div>

      <div className="table-wrap" role="region" aria-label="Coding patterns quick reference" tabIndex={0}>
      <table className="table">
      <caption>Typical time and auxiliary-space costs of common coding interview patterns.</caption>
      <tbody>
        <tr>
          <th scope="col">Coding pattern</th>
          <th scope="col">Typical time complexity</th>
          <th scope="col">Typical auxiliary space</th>
          <th scope="col" className="notes">Typical problems and caveats</th>
        </tr>
        <tr>
          <td>Two pointers</td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="green">O(1)</code></td>
          <td className="notes">Pair sum on a sorted array, removing duplicates in place, palindrome check. If the input is not sorted and the pattern needs it, add O(n log n) for the sort.</td>
        </tr>
        <tr>
          <td>Sliding window</td>
          <td><code className="yellow">O(n)</code></td>
          <td><code className="green">O(1)</code> or <code className="yellow">O(n)</code></td>
          <td className="notes">Longest substring or subarray under a constraint. Space is O(1) for a running sum or count, and grows when the window stores its contents, such as a character map or a deque for the window maximum.</td>
        </tr>
        <tr>
          <td>Prefix sums</td>
          <td><code className="yellow">O(n)</code> preprocessing; <code className="green">O(1)</code> per range sum</td>
          <td><code className="yellow">O(n)</code></td>
          <td className="notes">Many range-sum queries on a fixed array. Updates to the array force a rebuild, or a Fenwick or segment tree instead.</td>
        </tr>
        <tr>
          <td>Hash map frequency counting</td>
          <td>Expected <code className="yellow">O(n)</code> total</td>
          <td><code className="yellow">O(n)</code></td>
          <td className="notes">Anagrams, duplicates, two-sum. Relies on expected O(1) hash operations; heavy collisions can make a single operation O(n).</td>
        </tr>
        <tr>
          <td>Monotonic stack</td>
          <td><code className="yellow">O(n)</code> total</td>
          <td><code className="yellow">O(n)</code></td>
          <td className="notes">Next greater element, daily temperatures, largest rectangle in a histogram. Each item is pushed and popped at most once.</td>
        </tr>
        <tr>
          <td>Backtracking and subsets</td>
          <td><code className="dark-red">O(2<sup>n</sup>)</code> output generation</td>
          <td>Depends on implementation</td>
          <td className="notes">Recursion depth alone is O(n). Storing every subset needs O(n·2<sup>n</sup>) space, and copying each subset into the result adds a factor of n to the time.</td>
        </tr>
        <tr>
          <td>Permutations</td>
          <td><code className="dark-red">O(n·n!)</code> to generate all permutations</td>
          <td>Depends on output and implementation</td>
          <td className="notes">There are n! permutations of length n. Recursion depth is O(n); storing all of them takes O(n·n!).</td>
        </tr>
        <tr>
          <td>Dynamic programming</td>
          <td>Number of states × transitions per state</td>
          <td>Depends on memoization or tabulation</td>
          <td className="notes">Knapsack with n items and capacity W has n·W states with two transitions each, so O(n·W) time. Tabulation often lets you keep only the previous row, cutting space to O(W). Memoization also uses recursion stack space.</td>
        </tr>
      </tbody></table>
      </div>
    </>
  );
}
