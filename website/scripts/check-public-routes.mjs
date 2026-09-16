import fs from 'node:fs';
import assert from 'node:assert/strict';
const base = process.env.REVIEW_BASE_URL || 'http://localhost:3200';
const xml = await (await fetch(base + '/sitemap.xml')).text();
const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
assert.equal(new Set(routes).size, routes.length, 'Duplicate sitemap routes');
assert(!xml.includes('2026-06-10'), 'Stale fallback date');
const results = [], links = new Set();
for (let offset=0; offset<routes.length; offset+=6) {
  await Promise.all(routes.slice(offset,offset+6).map(async path => {
    const res=await fetch(base+path); const html=await res.text();
    const visible=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
    const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
    const canonical=html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    const description=html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/)?.[1];
    const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
    assert.equal(res.status,200,path); assert(title&&description&&canonical,path+' missing metadata');
    assert.equal(canonical,'https://gopuexports.com'+(path==='/'?'':path),path+' canonical');
    assert.equal((visible.match(/<h1\b/g)||[]).length,1,path+' H1');
    assert.doesNotMatch(visible,/\b(sourcing|procurement)\b|87128|Operations Manager|Warangal/i,path+' stale copy');
    const org=schemas.find(s=>s['@type']==='Organization');assert(org,path+' Organization schema');
    assert.equal(org.telephone,'+91 9618991917');assert.equal(org.legalName,'Gopu Exports Private Limited');assert.equal(org.address.addressLocality,'Hyderabad');assert(!org.sameAs,path+' unverified profiles');
    for(const m of visible.matchAll(/href="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) if(!m[1].startsWith('/api/')&&!m[1].startsWith('/_next/')&&!/\.[a-z0-9]+$/i.test(m[1]))links.add(m[1]);
    results.push({path,status:res.status,title,canonical,schemas:schemas.map(s=>s['@type'])});
  }));
}
const redirect=await fetch(base+'/resources/inquiry-procurement-support',{redirect:'manual'});assert.equal(redirect.status,308);assert(redirect.headers.get('location')?.endsWith('/resources/export-enquiry-support'));
for(const path of links){if(routes.includes(path))continue;const r=await fetch(base+path);assert(r.status<400,'Broken internal link '+path);}
const products=await (await fetch(base+'/api/products')).json();assert(products.length>0);for(const p of products)assert.doesNotMatch(JSON.stringify(p),/\b(sourcing|procurement)\b/i);
const unknown=await fetch(base+'/products/not-a-real-product'); const unknownHtml = await unknown.text(); assert(unknown.status === 404 || (unknown.status === 200 && /name="robots" content="noindex"/.test(unknownHtml)), 'Unknown product must be 404 or streamed noindex');
const robotsResponse=await fetch(base+'/robots.txt'); const robots=await robotsResponse.text(); assert.equal(robotsResponse.status,200); assert.match(robots,/Allow: \/(?:\r?\n|$)/); assert.match(robots,/Disallow: \/admin/); assert.match(robots,/Disallow: \/dashboard/); assert.match(robots,/Disallow: \/api/); assert.match(robots,/Sitemap: https:\/\/gopuexports\.com\/sitemap\.xml/);
results.sort((a,b)=>a.path.localeCompare(b.path));
fs.writeFileSync('docs/audit/route-check.json',JSON.stringify({base,routes:results,internalLinks:links.size,redirect:308,publicProducts:products.length,unknownProduct:unknown.status,unknownProductNoindex:unknownHtml.includes('content="noindex"')},null,2));
console.log(`PASS: ${results.length} sitemap routes, ${links.size} internal paths, metadata/schema/identity, robots, public products, 308 redirect and unknown-product noindex.`);
