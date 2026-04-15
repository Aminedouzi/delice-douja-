/**
 * One-shot health check: env + Supabase REST can see `products`.
 * Run: npm run doctor
 */
import * as fs from "fs";
import https from "https";
import * as path from "path";
import { fileURLToPath } from "url";

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
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.end();
  });
}

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

function mergeEnv() {
  const a = parseEnvFile(path.join(root, ".env"));
  const b = parseEnvFile(path.join(root, ".env.local"));
  return { ...a, ...b };
}

const env = mergeEnv();
const url = (env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const service = env.SUPABASE_SERVICE_ROLE_KEY || "";

let errors = 0;
let warns = 0;

function err(msg) {
  console.error(`\x1b[31m✖\x1b[0m ${msg}`);
  errors++;
}
function warn(msg) {
  console.warn(`\x1b[33m!\x1b[0m ${msg}`);
  warns++;
}
function ok(msg) {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`);
}

console.log("\n=== Délice Douja — setup doctor ===\n");

if (process.cwd().includes(" ")) {
  warn(
    `Your project path contains spaces: "${process.cwd()}"\n  On Windows this often breaks Turbopack (500s, "missing required error components"). Use: npm run dev (webpack, default) — not dev:turbo.\n  Best fix: move the folder to a path without spaces, e.g. C:\\\\dev\\\\delice-douja`
  );
}

if (!url) err("NEXT_PUBLIC_SUPABASE_URL is missing (.env or .env.local)");
else ok(`Supabase URL set (${url.slice(0, 40)}…)`);

if (!anon || anon.length < 40)
  err("NEXT_PUBLIC_SUPABASE_ANON_KEY missing or too short — paste from Supabase → Settings → API → anon");
else ok("Anon key present");

if (!service || service.length < 40)
  warn(
    "SUPABASE_SERVICE_ROLE_KEY missing — store/admin product create & edit will fail until you add it (same API page, service_role → Reveal)."
  );
else ok("Service role key present (admin DB writes OK)");

if (!env.ADMIN_JWT_SECRET || env.ADMIN_JWT_SECRET.length < 16)
  warn("ADMIN_JWT_SECRET weak or missing — /admin login may break");

if (errors > 0) {
  console.log("\nFix the items above, then: npm run doctor\n");
  process.exit(1);
}

async function checkProductsTable() {
  const endpoint = `${url}/rest/v1/products?select=id&limit=1`;
  try {
    const res = await httpsGet(endpoint, {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      Accept: "application/json",
    });
    const text = res.text;
    if (res.status >= 200 && res.status < 300) {
      ok("Table `public.products` is visible to the API (REST returned OK)");
      return;
    }
    if (
      res.status === 404 ||
      text.includes("schema cache") ||
      text.includes("PGRST205") ||
      /could not find.*products/i.test(text)
    ) {
      err(
        "API cannot see `public.products`. In Supabase: SQL → New query → paste ALL of supabase/schema.sql → Run.\n  Then Table Editor should list `products`. Project must match this URL in .env.local."
      );
      return;
    }
    warn(`Unexpected REST response ${res.status}: ${text.slice(0, 200)}`);
  } catch (e) {
    err(`Network error talking to Supabase: ${e.message}`);
  }
}

await checkProductsTable();

if (errors > 0) {
  console.log("\nAfter fixing, run: npm run doctor\n");
  process.exit(1);
}

console.log("\n--- Next steps ---");
console.log("  npm run dev:clean   (clean .next + webpack dev — recommended on Windows)");
console.log("  npm run dev:turbo   only if path has no spaces and you want Turbopack");
console.log("  If errors persist: move project to a path WITHOUT spaces.\n");

if (warns > 0) process.exit(0);
process.exit(0);
