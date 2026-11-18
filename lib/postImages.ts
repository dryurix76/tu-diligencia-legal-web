import fs from 'node:fs';
import path from 'node:path';

// Server-only: finds optional cover photos in public/blog/<slug>.(webp|jpg|png).
export function postImages(): Record<string, string> {
  const dir = path.join(process.cwd(), 'public', 'blog');
  const out: Record<string, string> = {};
  try {
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(/^([a-z0-9-]+)\.(webp|jpg|jpeg|png)$/);
      if (m && !out[m[1]]) out[m[1]] = `/blog/${f}`;
    }
  } catch { /* no folder */ }
  return out;
}
