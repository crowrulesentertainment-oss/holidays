import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git','node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
await walk(root);
let failures = 0;
for (const file of htmlFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/(?:href|src)=(["'])(.*?)\1/gi)) {
    const target = match[2].trim();
    if (!target || /^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(target)) continue;
    const localPath = target.split('#')[0].split('?')[0];
    if (!localPath) continue;
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(localPath));
    try { await access(resolved); }
    catch { console.error(`Broken local reference: ${path.relative(root,file)} -> ${target}`); failures++; }
  }
}
if (!htmlFiles.length) { console.error('No HTML files found.'); process.exit(1); }
console.log(`Checked local references in ${htmlFiles.length} HTML pages.`);
if (failures) process.exit(1);
