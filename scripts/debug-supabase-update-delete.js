const fs = require('fs');
const path = require('path');
function parseEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  const text = fs.readFileSync(file, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}
const root = process.cwd();
const env = {
  ...parseEnv(path.join(root, '.env')),
  ...parseEnv(path.join(root, '.env.local')),
};
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('missing env');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
(async () => {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  console.log('select first', error ? error.message : data);
  if (error || !data || !data.length) return;
  const id = data[0].id;
  const { data: upd, error: err2 } = await supabase.from('products').update({ name: data[0].name + 'X' }).eq('id', id).select().single();
  console.log('update', err2 ? err2.message : upd);
  const { error: err3 } = await supabase.from('products').delete().eq('id', id);
  console.log('delete', err3 ? err3.message : 'ok');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
