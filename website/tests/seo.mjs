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
console.log('10 search and editorial-title regression checks passed');
