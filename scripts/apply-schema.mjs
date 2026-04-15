/**
 * Applies supabase/schema.sql using Postgres (DATABASE_URL).
 * Get URI: Supabase → Project Settings → Database → Connection string → URI
 * Use "Session" or "Transaction" mode; password is your DATABASE password (not anon JWT).
 *
 * npm run db:apply
 */
import * as fs from "fs";
import * as path from "path";
import pg from "pg";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const out = {};
  for (const name of [".env.local", ".env"]) {
    const p = path.join(root, name);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (v && out[k] === undefined) out[k] = v;
    }
  }
  return out;
}

function stripSqlComments(sql) {
  return sql
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}

function splitStatements(sql) {
  const cleaned = stripSqlComments(sql);
  return cleaned
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

const env = loadEnv();
const conn =
  process.env.DATABASE_URL?.trim() ||
  env.DATABASE_URL?.trim() ||
  env.SUPABASE_DATABASE_URL?.trim();

if (!conn) {
  console.error(`
Missing DATABASE_URL.

1) Open: https://supabase.com/dashboard/project/kgyeyjxvtoumrjpzmdnt/settings/database
2) Connection string → URI → copy (Session pooler is fine).
3) Replace [YOUR-PASSWORD] with your database password (if you forgot: "Reset database password" on same page).
4) Add ONE line to .env.local:

   DATABASE_URL="postgresql://postgres.xxx:YOUR_PASSWORD@aws-0-....pooler.supabase.com:6543/postgres"

   (Use the exact string Supabase shows; port 5432 or 6543 as given.)

5) Run: npm run db:apply
`);
  process.exit(1);
}

const schemaPath = path.join(root, "supabase", "schema.sql");
if (!fs.existsSync(schemaPath)) {
  console.error("Missing file:", schemaPath);
  process.exit(1);
}

const fullSql = fs.readFileSync(schemaPath, "utf8");
const statements = splitStatements(fullSql);

const client = new pg.Client({
  connectionString: conn,
  ssl: { rejectUnauthorized: false },
});

console.log("Connecting to Postgres…");
try {
  await client.connect();
} catch (e) {
  console.error("Connection failed:", e.message);
  process.exit(1);
}

let n = 0;
for (const stmt of statements) {
  const sql = `${stmt};`;
  try {
    await client.query(sql);
    n++;
    const preview = stmt.replace(/\s+/g, " ").slice(0, 72);
    console.log("OK:", preview + (preview.length >= 72 ? "…" : ""));
  } catch (e) {
    if (/notify\s+pgrst/i.test(stmt)) {
      console.warn("WARN (non-fatal):", e.message);
      continue;
    }
    console.error("Failed on:\n", sql.slice(0, 200));
    console.error(e.message);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

await client.end();
console.log(`\nDone: ${n} statements applied. Run: npm run check:db\n`);
