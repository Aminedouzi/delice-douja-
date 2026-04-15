/**
 * Verifies public.products and public.orders exist via PostgREST (same as the app).
 * Reads .env then .env.local from project root. Does not print secrets.
 * Usage: node scripts/check-supabase-tables.mjs
 */
import * as fs from "fs";
import https from "https";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function parseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function httpsGet(urlStr, headers) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const req = https.request(
      {
        hostname: u.hostname,
        path: `${u.pathname}${u.search}`,
        port: u.port || 443,
        method: "GET",
        headers,
      },
      (res) => {
        let body = "";
        res.on("data", (c) => {
          body += c;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode ?? 0, text: body });
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.end();
  });
}

const env = {
  ...parseEnvFile(path.join(root, ".env")),
  ...parseEnvFile(path.join(root, ".env.local")),
};

const base = (env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!base || !anon) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env / .env.local");
  process.exit(1);
}

async function checkTable(name) {
  const endpoint = `${base}/rest/v1/${name}?select=id&limit=1`;
  const res = await httpsGet(endpoint, {
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    Accept: "application/json",
  });
  const ok = res.status >= 200 && res.status < 300;
  const missing =
    res.status === 404 ||
    res.text.includes("schema cache") ||
    res.text.includes("PGRST205") ||
    new RegExp(`could not find.*${name}`, "i").test(res.text);
  return {
    name,
    ok,
    missing,
    status: res.status,
    snippet: res.text.slice(0, 120).replace(/\s+/g, " "),
  };
}

console.log(`\nSupabase project URL: ${base}\n`);
console.log("Checking tables (public schema, Data API)…\n");

const tables = ["products", "orders"];
let allOk = true;

for (const t of tables) {
  try {
    const r = await checkTable(t);
    if (r.ok) {
      console.log(`  ✓ public.${t} — OK (HTTP ${r.status}, table exists)`);
    } else if (r.missing) {
      console.log(`  ✗ public.${t} — NOT FOUND (API does not see this table)`);
      allOk = false;
    } else {
      console.log(`  ? public.${t} — HTTP ${r.status}: ${r.snippet}`);
      allOk = false;
    }
  } catch (e) {
    console.log(`  ✗ public.${t} — ERROR: ${e.message}`);
    allOk = false;
  }
}

console.log("");
if (!allOk) {
  console.log("Fix: Supabase → SQL → New query → paste full file: supabase/schema.sql → Run");
  console.log("Then: Table Editor should list products and orders.\n");
  process.exit(1);
}

console.log("All checked tables exist.\n");
process.exit(0);
