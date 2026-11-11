export default function Notation() {
  return (
    <>
      <h2 id="notation">Reading the notation</h2>
      <ul>
        <li><code>O(...)</code> describes an asymptotic upper bound.</li>
        <li><code>Ω(...)</code> describes an asymptotic lower bound.</li>
        <li><code>Θ(...)</code> describes a tight asymptotic bound.</li>
        <li><code>n</code> is the input size. Graph algorithms use <code>V</code> for vertices and <code>E</code> for edges. Some algorithms use extra parameters, such as <code>k</code> or <code>m</code>, as noted in each table.</li>
        <li><code>α(n)</code> is the inverse Ackermann function. It grows so slowly that it is at most 4 for any practical input.</li>
        <li>Average (expected) cost depends on a stated assumption, such as random input or a well-behaved hash function. Amortized cost is the average per operation over a worst-case sequence of operations and involves no randomness. Worst-case cost is the most a single operation can take. See the notes under the data structure table.</li>
        <li>Tables use Θ where a bound is known to be tight, O for upper bounds, and Ω for lower bounds.</li>
        <li><code>N/A</code> means the operation is not applicable in that table&apos;s context.</li>
      </ul>
      <p>Complexities are quick-reference summaries. Actual performance depends on the implementation, the input, and the assumptions behind each operation, so check the linked references when exact guarantees matter.</p>
    </>
  );
}
