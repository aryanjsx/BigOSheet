# BigOSheet

**Learn how computers think, in plain English.**

BigOSheet is a place to understand data structures and algorithms without needing a computer science degree, and to look up the details when you do need them. It pairs a friendly blog with a complete, interactive Big O cheat sheet.

## Why it exists

Most coding resources are written for people who already know the jargon. Most reference sheets give you a table of symbols and no explanation. BigOSheet tries to do both jobs well:

- **For curious beginners:** short articles that start with an everyday picture, like a treasure hunt for linked lists or a phone book for binary search, then build up to the code.
- **For interview prep and quick lookups:** a reference where every bound says whether it is best, average, amortized or worst case, and what it assumes.

## What you can do

### Read articles that make sense

- Every article opens with a one-line **"In plain English"** summary.
- Each one is tagged for who it suits: no tech background, a little curiosity, or a deep dive.
- Search by keyword or browse by subject.
- **Log in to save articles** for later and pick up where you left off. Your library keeps both your saved and recently read articles.

### Use the Big O cheat sheet

- **34 topics** covering data structures, sorting, searching, graphs, trees, heaps and coding patterns. Each has its own page with time and space costs, pitfalls and code in several languages.
- **Reference tables** for basics, data structures, sorting, and search and graph algorithms, colour-coded from cheapest (green) to exponential (dark red).
- **Algorithm visualizer** that steps through linear and binary search, bubble, insertion, merge and quick sort, and BFS and DFS, one move at a time, with live counters.
- **Growth playground** to see how O(1), O(log n), O(n) and O(n²) pull apart as the input grows.
- **Compare and lookup tools** for putting two algorithms side by side or finding the cost of one operation fast.
- **Practice:** a roadmap with a suggested learning order, a quiz, code challenges where you predict the complexity of a snippet, and a one-page revision sheet.
- **Take it with you:** export the tables as Markdown or CSV, print topic cards, or download the PDFs.
- Your learning progress, bookmarks and quiz scores are saved in your own browser, with no account needed.

### Feel good doing it

A calm, editorial design with serif headlines, generous spacing and a single accent colour. It works in light and dark mode, on phones and desktops, and the cheat sheet is keyboard friendly (press `?` for shortcuts).

## For the site owner

One account, set by `ADMIN_EMAIL`, can write, draft, publish and delete articles and manage users. That account is created from a password you set on the server and can't be claimed through the signup form. Everyone else signs up as a regular reader.

Article web addresses come straight from the title: "Singly Linkedlist" lives at `/singlylinkedlist`.

## Run it yourself

You need Node 22.13 or newer.

```bash
npm install
cp .env.example .env.local   # on Windows PowerShell: Copy-Item .env.example .env.local
npm run db:local             # terminal 1: a throwaway local Postgres, no install needed
npm run dev                  # terminal 2
```

Open `.env.local` and set `ADMIN_PASSWORD`. For local work, set `DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres`. The first request creates the tables, the admin account and three sample articles.

To deploy, use any host that runs Next.js and point `DATABASE_URL` at a Postgres database. Set `ADMIN_PASSWORD`, `ADMIN_EMAIL` and `SITE_URL` in the host's environment, and never commit `.env.local`.

## Built with

Next.js (App Router), TypeScript, Postgres, and Vitest for the cheat-sheet data checks (`npm test`).

## Contributing

Found a bound that looks wrong, or want to add a topic? Open an issue with a source, or read [CONTRIBUTING.md](CONTRIBUTING.md). Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Licence

MIT. See [LICENSE](LICENSE).
