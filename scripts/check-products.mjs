import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.join(process.cwd(), ".env.local");
const envRaw = fs.readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  envRaw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("=");
      if (idx === -1) return null;
      const key = line.slice(0, idx);
      let value = line.slice(idx + 1);
      if (value.startsWith("\"") && value.endsWith("\"")) {
        value = value.slice(1, -1);
      }
      return [key, value];
    })
    .filter(Boolean)
);

const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!env.NEXT_PUBLIC_SUPABASE_URL || !key) {
  console.error("Missing required env values");
  process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);
const response = await supabase
  .from("products")
  .select("id,name,category,created_at")
  .order("created_at", { ascending: false });

console.log(JSON.stringify(response, null, 2));
