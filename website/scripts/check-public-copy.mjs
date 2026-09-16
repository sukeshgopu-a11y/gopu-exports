import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
function loadTs(file) {
  const compiled = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  new Function('require', 'module', 'exports', code)((name) => ['./productEditorial.json', './blogEditorial.json'].includes(name) ? JSON.parse(fs.readFileSync('lib/' + name.slice(2), 'utf8')) : (() => { throw new Error('Unexpected dependency: ' + name); })(), compiled, compiled.exports);
  return compiled.exports;
}
const { cleanPublicProduct } = loadTs('lib/publicProductCopy.ts');
const live = JSON.parse(fs.readFileSync('docs/audit/live-products.json', 'utf8'));
const snapshot = JSON.stringify(live);
const factFields = ['origin', 'moq', 'lead', 'hs', 'shelfLife', 'packaging', 'specs', 'containerCapacity', 'exportPorts'];
for (const product of live) {
  const cleaned = cleanPublicProduct(product);
  for (const field of factFields) assert.deepEqual(cleaned[field], product[field], `${product.slug}: altered fact ${field}`);
  assert.doesNotMatch(JSON.stringify(cleaned), /\b(sourcing|procurement)\b|87128|Operations Manager|Warangal/i, product.slug);
  assert.deepEqual(cleanPublicProduct(cleaned), cleaned, `${product.slug}: not idempotent`);
  assert.equal(cleaned.certifications.length, 0, `${product.slug}: unverified certification`);
}
assert.equal(JSON.stringify(live), snapshot, 'Public cleanup mutated input');
const later = { ...live[0], description: 'New buyer-approved export description.' };
assert.equal(cleanPublicProduct(later).description, later.description, 'Later admin edit overwritten');
const { PRODUCTS } = loadTs('lib/products.ts');
for (const product of PRODUCTS) assert.doesNotMatch(JSON.stringify(product), /\b(sourcing|procurement)\b|87128|Operations Manager|Warangal/i);
assert.equal(new Set(PRODUCTS.map(p => p.slug)).size, PRODUCTS.length);
console.log(`PASS: ${live.length} live records, ${PRODUCTS.length} fallback records; terminology, immutable facts, idempotence, admin edits and unique routes.`);

const { cleanPublicBlog } = loadTs("lib/publicBlogCopy.ts");
const { DEFAULT_BLOGS } = loadTs("lib/blogs.ts");
for (const post of DEFAULT_BLOGS) { const cleaned = cleanPublicBlog(post); assert.doesNotMatch(JSON.stringify(cleaned), /\b(sourcing|procurement)\b/i); assert.deepEqual(cleanPublicBlog(cleaned), cleaned); }
console.log("PASS: public article copy is clean and idempotent.");

const originalArticles = JSON.parse(fs.readFileSync("docs/audit/seed-blogs-before.json", "utf8"));
for (const post of originalArticles) { const cleaned = cleanPublicBlog(post); assert.doesNotMatch(JSON.stringify(cleaned), /\b(sourcing|procurement)\b/i, post.slug); assert.deepEqual(cleanPublicBlog(cleaned), cleaned); assert.equal(cleaned.createdAt, post.createdAt); }
console.log(`PASS: ${originalArticles.length} legacy articles cleaned, publication dates preserved.`);
