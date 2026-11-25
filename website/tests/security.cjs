/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const ts = require(process.cwd() + '/node_modules/typescript');
const Module = require('module');
const assert = require('node:assert/strict');
function load(path) {
 const m = new Module(path, module); m.filename=path; m.paths=module.paths;
 m._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,path);return m.exports;
}
(async()=>{
 const csv=load(process.cwd()+'/lib/csv.ts');
 assert.equal(csv.csvEscape('a"b\nc'),'"a""b\nc"');
 for(const x of ['=SUM(A1)',' +919618991917','\t@cmd','-2']) assert.equal(csv.csvEscape(x),`"'${x}"`);
 assert.equal(csv.encodeCsv([['a','b'],['x','y']]),'"a","b"\r\n"x","y"');
 const {readBoundedJson,BodyTooLargeError}=load(process.cwd()+'/lib/requestBody.ts');
 assert.deepEqual(await readBoundedJson(new Request('https://test',{method:'POST',body:'{"ok":true}'})),{ok:true});
 await assert.rejects(()=>readBoundedJson(new Request('https://test',{method:'POST',body:'"'+ 'é'.repeat(20)+'"'}),20),BodyTooLargeError);
 await assert.rejects(()=>readBoundedJson(new Request('https://test',{method:'POST',body:'invalid'})),SyntaxError);
 console.log('CSV and bounded-body regression checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
