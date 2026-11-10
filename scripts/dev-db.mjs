// A throwaway local Postgres (PGlite) for development, so you don't need Docker or an install.
// Data is kept in ./data/pg. Run:  npm run db:local   then use DATABASE_URL below in .env.local
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const db = await PGlite.create("./data/pg");
const server = new PGLiteSocketServer({ db, port: 5433, host: "127.0.0.1" });
await server.start();
console.log("Local Postgres ready:\n  DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres");
process.on("SIGINT", async () => { await server.stop(); await db.close(); process.exit(0); });
