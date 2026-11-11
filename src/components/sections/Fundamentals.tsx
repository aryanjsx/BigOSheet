import Playground from "@/components/interactive/Playground";

export default function Fundamentals() {
  return (
    <>

      <Playground />
      <p className="footnotes">Logarithms are base 2. In the linear view the chart clips at the top, so the steepest curves leave the plot early. Switch the operations axis to logarithmic to keep every curve in view, or type a larger n to see the table values diverge. Time estimates divide the operation count by an assumed 10<sup>8</sup> simple operations per second. They are not measurements: hardware, the language runtime, constant factors, memory access, and the input all change real running time.</p>

      <h2 id="examples">Code for each class</h2>
      <div className="examples">
        <article className="example">
          <h3>O(1): constant</h3>
          <p>Work does not depend on input size.</p>
      <pre><code>{`def first(items):
    return items[0]`}</code></pre>
        </article>
        <article className="example">
          <h3>O(log n): logarithmic</h3>
          <p>Each step discards half of what remains.</p>
      <pre><code>{`def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`}</code></pre>
        </article>
        <article className="example">
          <h3>O(n): linear</h3>
          <p>One pass over the input.</p>
      <pre><code>{`def total(items):
    result = 0
    for x in items:
        result += x
    return result`}</code></pre>
        </article>
        <article className="example">
          <h3>O(n log n): linearithmic</h3>
          <p>Sorting dominates, then one linear pass.</p>
      <pre><code>{`def has_duplicates(items):
    items = sorted(items)
    return any(a == b for a, b in zip(items, items[1:]))`}</code></pre>
        </article>
        <article className="example">
          <h3>O(n<sup>2</sup>): quadratic</h3>
          <p>A loop inside a loop over the same input.</p>
      <pre><code>{`def has_pair_sum(items, target):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] + items[j] == target:
                return True
    return False`}</code></pre>
        </article>
        <article className="example">
          <h3>O(2<sup>n</sup>): exponential</h3>
          <p>Every item doubles the number of branches.</p>
      <pre><code>{`def count_subsets(items, target, i=0):
    if i == len(items):
        return 1 if target == 0 else 0
    take = count_subsets(items, target - items[i], i + 1)
    skip = count_subsets(items, target, i + 1)
    return take + skip`}</code></pre>
        </article>
      </div>

      <h2 id="color-key">Color key</h2>
      <ul className="legend" aria-label="Color key for complexity classes">
        <li><code className="green">O(1)</code></li>
        <li><code className="yellow-green">O(log n)</code></li>
        <li><code className="yellow">O(n)</code></li>
        <li><code className="orange">O(n log n)</code></li>
        <li><code className="red">O(n<sup>2</sup>)</code></li>
        <li><code className="dark-red">O(2<sup>n</sup>)</code></li>
        <li><code className="gray">N/A or not applicable</code></li>
      </ul>
    </>
  );
}
