import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports });
  return exports;
}
const { matchesProductSearch: match } = load('lib/productSearch.ts');
assert.equal(match(['Turmeric', 'Curcumin content'], 'cumin'), false);
assert.equal(match(['Cumin Seeds', 'Indian whole spice'], 'cumin'), true);
assert.equal(match(['Cumin Seeds', 'Indian whole spice'], 'ind cumin'), true);
assert.equal(match(['Cumin Seeds'], 'cumin rice'), false);
assert.equal(match(['Chilli Powder'], 'CHILLI-POW'), true);
assert.equal(match(['Café'], 'cafe'), true);
assert.equal(match([undefined, 'Rice'], ''), true);
const { editorialSearchTitle } = load('lib/seo.ts');
assert.equal(editorialSearchTitle('How to Choose a Reliable Agricultural Exporter from India | GOPU Exports'), 'Choosing an Agricultural Exporter in India');
assert.equal(editorialSearchTitle('A future editor title'), 'A future editor title');
assert.equal(editorialSearchTitle('A future editor title | GOPU Exports'), 'A future editor title');
const { hsDisplayLabel } = load('lib/publicSpecifications.ts');
assert.equal(hsDisplayLabel('1006'), 'HS Heading (4-digit)');
assert.equal(hsDisplayLabel('1006 30 20'), 'HS Code');
assert.equal(hsDisplayLabel('0904 21 10'), 'HS Code');
const productPageSource = fs.readFileSync('app/products/[slug]/page.tsx', 'utf8');
assert.match(productPageSource, /hsDisplayLabel/);
assert.match(productPageSource, /four-digit HS heading/i);
const specificationRouteSource = fs.readFileSync('app/api/products/[id]/specification/route.ts', 'utf8');
assert.match(specificationRouteSource, /hsDisplayLabel/);
console.log('10 search/editorial checks and 5 HS-heading clarity regressions passed');

const homePage = fs.readFileSync("app/page.tsx", "utf8");
const featuredPriority = homePage.match(/const priority = \[([^\]]+)\]/)?.[1] ?? "";
assert.match(featuredPriority, /"basmati-1121-rice"/, "Homepage featured products should include 1121 Basmati Rice");
assert.doesNotMatch(featuredPriority, /"basmati-rice"/, "Homepage should not substitute generic Basmati Rice for the priority 1121 product");
const sitemapSource = fs.readFileSync("app/sitemap.ts", "utf8");
assert.match(sitemapSource, /"": "2026-11-14"/, "Homepage sitemap lastModified should reflect the 14 Nov 2026 homepage update");
assert.match(sitemapSource, /const PRODUCT_TEMPLATE_REVISED = "2026-11-17"/, "Product sitemap lastModified should reflect the 17 Nov 2026 product-page and specification update");

const { formatCommercialMoq } = load('lib/moq.ts');
const spiceMoq = "Bulk orders accepted; final quantity depends on packaging, destination, and availability";
for (const product of [
  { slug: 'cumin-seeds', title: 'Cumin Seeds', category: 'Spices', moq: '1 MT' },
  { slug: 'turmeric-fingers', title: 'Turmeric Fingers', category: 'Spices', moq: '1 MT' },
  { slug: 'turmeric-powder', title: 'Turmeric Powder', category: 'Spices', moq: '1 MT' },
  { slug: 'red-chilli', title: 'Red Chilli (Whole)', category: 'Spices', moq: '1 MT' },
]) {
  assert.equal(formatCommercialMoq(product), spiceMoq, `Category MOQ display should follow the product-page wording for ${product.slug}`);
}
assert.equal(
  formatCommercialMoq({ slug: 'basmati-1121-rice', title: '1121 Basmati Rice', category: 'Rice & Grains', moq: '1 x 20 ft container' }),
  'LCL/FCL available based on destination and product category',
  '1121 Basmati category MOQ should describe shipping options consistently with its product page'
);
assert.equal(
  formatCommercialMoq({ slug: 'fresh-potato', title: 'Fresh Potato', category: 'Fresh Vegetables', moq: '1 x 20 ft container' }),
  '1 x 20 ft container',
  'The configured fresh-potato minimum must remain unchanged'
);
const categoryPageSource = fs.readFileSync('app/export/[slug]/page.tsx', 'utf8');
assert.match(categoryPageSource, /formatCommercialMoq\(product\)/, 'Category product cards must use the shared commercial MOQ formatter');
