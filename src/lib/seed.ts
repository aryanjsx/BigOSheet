export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  tldr: string;
  emoji: string;
  level: "starter" | "curious" | "deep";
  tags: string[];
  content: string;
};

export const SEED_POSTS: SeedPost[] = [
  {
    slug: "singlylinkedlist",
    title: "Singly linked list",
    emoji: "🔗",
    level: "starter",
    tags: ["dsa", "linked-list", "basics"],
    excerpt:
      "A singly linked list is a treasure hunt: every clue tells you where the next one is hidden.",
    tldr: "A list where each item only knows the item right after it. Easy to add things, slow to jump around.",
    content: `## The treasure hunt idea

Imagine a treasure hunt. You get **one clue**. That clue tells you where to find the **next clue**. And so on, until you reach the treasure.

That is exactly how a *singly linked list* works.

- Each clue is called a **node**.
- A node holds two things: some **data** (the clue) and a **pointer** (the address of the next node).
- The first node is called the **head**. The last node points at nothing, which we call **null**.

\`\`\`
[ 10 | •]──▶[ 20 | •]──▶[ 30 | •]──▶ null
   head
\`\`\`

> 💡 **Why "singly"?** Because each node only knows about the *next* one, never the one before it. One direction only.

## Why not just use a normal list?

A normal list (an *array*) is like seats in a cinema: everyone sits side by side, in fixed spots. Squeezing a new person into the middle means everyone after them has to shuffle along.

A linked list is more like a conga line. To add someone in the middle, you only change **two hands**: the person before now holds the newcomer, and the newcomer holds the next person. Nobody else moves.

## What is it good and bad at?

| Task | How fast? | In plain English |
| --- | --- | --- |
| Add to the front | Very fast | Just make a new head |
| Add after a known spot | Very fast | Re-wire two hands |
| Find the 50th item | Slow | You must follow every clue from the start |
| Go backwards | Not possible | Nodes only point forward |

## A tiny code example

\`\`\`js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null; // nothing after me yet
  }
}

const a = new Node(10);
const b = new Node(20);
const c = new Node(30);

a.next = b; // 10 → 20
b.next = c; // 20 → 30
\`\`\`

## Where do you see this in real life?

- The **undo** history in an editor
- The **next song** queue in a music app
- Browsers moving **forward** through pages

## Quick recap

1. Data is split into small boxes (nodes).
2. Each box points to the next one.
3. Great for adding and removing, not great for jumping to a specific spot.
`,
  },
  {
    slug: "bigoinplainenglish",
    title: "Big O in plain English",
    emoji: "⏱️",
    level: "starter",
    tags: ["big-o", "basics", "dsa"],
    excerpt:
      "Big O is just a way of asking: if my problem gets 10 times bigger, how much slower does my solution get?",
    tldr: "Big O describes how a task slows down as the amount of work grows. It is a growth rate, not a stopwatch.",
    content: `## Start with a phone book

You want to find "Priya" in a printed phone book.

- **Method 1:** read every name from page one. With 1,000 names, that is up to 1,000 checks. With 1,000,000 names, up to 1,000,000 checks.
- **Method 2:** open the middle, decide if Priya comes before or after, then repeat on the correct half. With 1,000,000 names you need about **20** checks.

Both methods work. Method 2 *scales* far better. Big O is the language we use to say that.

## The common ones, as everyday jobs

| Name | Looks like | Everyday example |
| --- | --- | --- |
| O(1) | Constant | Grabbing the top plate from a stack |
| O(log n) | Halving | The phone book trick above |
| O(n) | Linear | Reading every page of a book |
| O(n log n) | A bit more than linear | Sorting a deck of cards smartly |
| O(n²) | Squared | Everyone in a room shaking hands with everyone else |

> 💡 **Big O does not measure seconds.** A fast computer running a slow method can still lose to a slow computer running a clever one when the data gets big enough.

## Why should a non-programmer care?

Because it explains why an app feels fine with 10 users and falls over with 10 million. The *shape* of the growth matters more than today's speed.
`,
  },
  {
    slug: "binarysearch",
    title: "Binary search",
    emoji: "🔍",
    level: "curious",
    tags: ["algorithms", "searching", "dsa"],
    excerpt:
      "The 'guess my number' game, turned into one of the most useful ideas in computing.",
    tldr: "Keep cutting the search area in half. Works only when the items are already in order.",
    content: `## The guess-my-number game

I am thinking of a number between 1 and 100. You guess **50**. I say "higher". You have just thrown away half of all possibilities with a single question.

Guess **75**. "Lower." Now the answer is between 51 and 74. Keep going and you will find it in at most **7 guesses**.

## The recipe

1. Look at the **middle** item.
2. If it is what you want, stop.
3. If your target is smaller, keep only the **left half**. Otherwise keep the **right half**.
4. Repeat until you find it or run out of items.

## In code

\`\`\`js
function binarySearch(sorted, target) {
  let low = 0;
  let high = sorted.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // not found
}
\`\`\`

## The one catch

The items **must be sorted**. A shuffled phone book would make the middle-page trick useless.

> 💡 One billion items need only about **30** guesses. That is why this idea shows up everywhere, from databases to spell-checkers.
`,
  },
];
