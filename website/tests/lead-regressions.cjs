/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
function load(file, mocks={}, env={}) {
  const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const exports={};
  vm.runInNewContext(js,{exports,require:n=>n in mocks?mocks[n]:require(n),console,process:{env},Request,Response,Headers,FormData,URL,AbortSignal,TextDecoder,Uint8Array,Buffer,crypto,setTimeout,clearTimeout},{filename:file});
  return exports;
}
(async()=>{
  const rateKeys=[];
  const rateMocks={'server-only':{},'@/src/lib/supabase/admin':{createAdminClient:()=>({rpc:async(_name,args)=>{rateKeys.push(args.p_key);return {data:true,error:null};}})}};
  const rate=load('lib/rateLimit.ts',rateMocks,{VERCEL:'1'});
  const rateRequest=(ip,spoof='198.51.100.90')=>new Request('https://gopuexports.com/api/inquiries',{headers:{'x-vercel-forwarded-for':ip,'x-forwarded-for':spoof}});
  await rate.consumeRateLimit(rateRequest('192.0.2.1'),'leads',8,600);
  await rate.consumeRateLimit(rateRequest('192.0.2.2'),'leads',8,600);
  await rate.consumeRateLimit(rateRequest('192.0.2.1','198.51.100.91'),'leads',8,600);
  assert.notEqual(rateKeys[0],rateKeys[1]);assert.equal(rateKeys[0],rateKeys[2]);
  const unknown=load('lib/rateLimit.ts',rateMocks);
  await unknown.consumeRateLimit(rateRequest('192.0.2.1'),'leads',8,600);
  await unknown.consumeRateLimit(rateRequest('192.0.2.2'),'leads',8,600);
  assert.equal(rateKeys[3],rateKeys[4]);
  await rate.consumeRateLimit(rateRequest('forged-one'),'leads',8,600);
  await rate.consumeRateLimit(rateRequest('forged-two'),'leads',8,600);
  assert.equal(rateKeys[5],rateKeys[6]);
  const company=load('lib/company.ts').COMPANY;
  let contact={phone:'+918712816876',address:'Old saved address'};
  const companyMocks={'server-only':{},react:{cache:fn=>fn},'./company':{COMPANY:company},'@/src/lib/supabase/public':{createPublicClient:()=>({from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{value:contact},error:null})})})})})}};
  const publicCompany=load('lib/publicCompany.ts',companyMocks,{NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co'});
  assert.equal((await publicCompany.getPublicCompany()).phone,company.phone);
  contact={...contact,publicContactVersion:1};
  const published=await publicCompany.getPublicCompany();
  assert.equal(published.phone,contact.phone);assert.equal(published.hq.address,contact.address);
  assert.equal(published.registeredAddress,company.registeredAddress);
  const body=load('lib/requestBody.ts');
  let hits=0;
  const mocks={'./requestBody':body,'./rateLimit':{consumeRateLimit:async(_req,scope)=>{assert.equal(scope,'leads');return ++hits<=8;}}};
  const lead=load('lib/leadValidation.ts',mocks);
  const req=(path,body='{}')=>new Request('https://gopuexports.com'+path,{method:'POST',headers:{'content-type':'application/json'},body});
  for(let i=0;i<8;i++) assert.equal((await lead.prepareLeadRequest(req('/api/inquiries'))).ok,true);
  assert.equal((await lead.prepareLeadRequest(req('/api/contact'))).status,429);
  mocks['./rateLimit']={consumeRateLimit:async()=>true};
  const required=load('lib/leadValidation.ts',mocks,{TURNSTILE_REQUIRED:'true'});
  assert.equal((await required.prepareLeadRequest(req('/api/inquiry'))).status,403);
  const normal=load('lib/leadValidation.ts',mocks);
  assert.equal((await normal.prepareLeadRequest(req('/api/inquiry',JSON.stringify({name:'x'.repeat(40000)})))).status,413);
  assert.equal((await normal.prepareLeadRequest(req('/api/inquiry','{"admin_notes":"forged"}'))).status,400);
  assert.equal((await normal.prepareLeadRequest(req('/api/inquiry','{"phoneCountryName":"India","productOther":"Rice","countryOther":"UAE"}'))).ok,true);
  const route=load('app/api/test-email/route.ts',{'next/server':{NextResponse:{json:(body,options)=>({body,...options})}}});
  assert.equal(route.GET().status,404);
  const sends=[];
  class Resend {constructor(){this.emails={send:async(data)=>{sends.push(data);return {data:{id:'mock'}};}}}}
  const email=load('lib/email.ts',{resend:{Resend}},{RESEND_API_KEY:'test-only'});
  await email.sendAdminLeadEmail({id:'test-id',kind:'inquiry',name:'Buyer',email:'buyer@example.test',sourceUrl:'https://attacker.example/form'});
  assert.ok(sends[0].html.includes('https://gopuexports.com/dashboard/inquiries?lead=test-id'));
  assert.ok(!sends[0].html.includes('href="https://attacker.example/dashboard'));
  let adminCalls = 0, customerCalls = 0;
  const delivery = load('lib/leadEmail.ts', {'@/lib/email': {
    sendAdminLeadEmail: async()=>{adminCalls++;return {sent:true};},
    sendCustomerAutoReply: async()=>{customerCalls++;return {sent:true};},
  }});
  const original = {sent:true,sentAt:'2026-10-09T00:00:00Z'};
  const retried = await delivery.sendLeadEmails({id:'test',kind:'inquiry'}, {admin:original,customer:{sent:false}});
  assert.equal(adminCalls,0);assert.equal(customerCalls,1);assert.equal(retried.admin.sentAt,original.sentAt);
  console.log('Ingress trust, contact publication, lead limits, CAPTCHA, payload validation and email regressions passed');
})().catch(error=>{console.error(error);process.exitCode=1});
