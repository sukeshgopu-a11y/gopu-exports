# BUGS AND FIXES

> Supabase migration note, May 2026: the MongoDB blocker described below has been replaced by the Supabase setup documented in `docs/DATABASE.md` and `supabase/schema.sql`. Treat MongoDB-specific fixes as historical notes only.
## GOPU Exports — Actionable Fix Reference

Each bug is listed with the exact file(s), what's wrong, and the exact fix.

---

## BUG-001 — MongoDB Not Connected

**Severity:** 🔴 Critical  
**File:** `.env.local`  
**Symptom:** Products page shows infinite grey skeletons. Admin seed button shows "Seed failed". Homepage has no featured products.

**Fix:**
```bash
# In .env.local, replace:
MONGODB_URI=mongodb://127.0.0.1:27017/gopu-exports

# With your Atlas connection string:
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gopu-exports?retryWrites=true&w=majority
```
Then restart the dev server.

---

## BUG-002 — Upload API Has No Auth Guard

**Severity:** 🔴 Critical  
**File:** `app/api/upload/route.ts`  
**Symptom:** Any anonymous user can upload files to Supabase Storage.

**Fix — add these 3 lines at the top of the POST handler:**
```typescript
import { isAdmin, unauthorized } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();  // ← ADD THIS
  // ... rest of existing code
}
```

---

## BUG-003 — Gallery Dashboard Route Is Missing (404)

**Severity:** 🟠 High  
**File:** `components/dashboard/Sidebar.tsx` (links to `/dashboard/gallery`)  
**Missing file:** `app/dashboard/gallery/page.tsx`  
**Symptom:** Clicking "Gallery" in admin sidebar leads to a Next.js 404 page.

**Fix — create `app/dashboard/gallery/page.tsx`:**
```typescript
"use client";
export default function GalleryPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-[#0F172A] mb-6">Gallery</h1>
      <p className="text-gray-500">Gallery management coming soon.</p>
    </div>
  );
}
```
(Minimal stub to fix the 404. Full implementation is a Phase 1 task.)

---

## BUG-004 — Blog Posts Have No Public Pages

**Severity:** 🟠 High  
**Missing files:** `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`  
**Symptom:** Blog posts published in admin are invisible to website visitors.

**Fix — create `app/blog/page.tsx`:**
```typescript
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import Link from "next/link";

export const revalidate = 60;

export default async function BlogPage() {
  await connectDB();
  const posts = await BlogModel.find({ published: true })
    .sort({ createdAt: -1 })
    .lean();
  const blogs = JSON.parse(JSON.stringify(posts));

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-8">News & Insights</h1>
      <div className="space-y-8">
        {blogs.map((b: { _id: string; slug: string; title: string; excerpt: string; createdAt: string }) => (
          <div key={b._id} className="border-b border-gray-200 pb-8">
            <Link href={`/blog/${b.slug}`} className="text-2xl font-bold hover:text-[#0E7490]">{b.title}</Link>
            <p className="text-gray-500 mt-2">{b.excerpt}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
```

**Fix — create `app/blog/[slug]/page.tsx`:**
```typescript
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  await connectDB();
  const doc = await BlogModel.findOne({ slug: params.slug, published: true }).lean();
  if (!doc) notFound();
  const post = JSON.parse(JSON.stringify(doc));

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black mb-4">{post.title}</h1>
      <p className="text-gray-400 text-sm mb-8">By {post.author}</p>
      <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
}
```

---

## BUG-005 — InquiryChart Uses Hardcoded Data

**Severity:** 🟠 High  
**File:** `components/dashboard/InquiryChart.tsx`  
**Symptom:** Dashboard chart shows fake monthly inquiry counts (made-up numbers Jan–Dec).

**Fix — replace hardcoded data with MongoDB aggregate query in the dashboard page:**
In `app/dashboard/page.tsx`, add:
```typescript
// Aggregate inquiries by month for the current year
const year = new Date().getFullYear();
const pipeline = [
  { $match: { createdAt: { $gte: new Date(`${year}-01-01`) } } },
  { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
];
const monthlyData = await InquiryModel.aggregate(pipeline);
// Pass to chart component as prop
```

---

## BUG-006 — Dashboard Stats: "Export Markets" and "Response Rate" Are Fake

**Severity:** 🟠 High  
**File:** `app/dashboard/page.tsx`  
**Symptom:** Shows "18 Export Markets" and "100% Response Rate" — both hardcoded lies.

**Fix:** 
- Export Markets: `const markets = await InquiryModel.distinct("country")` → `markets.length`
- Response Rate: Either remove the card entirely, or compute from `replied + closed` vs `total`

---

## BUG-007 — Navbar/Footer Ignore Settings Changes

**Severity:** 🟠 High  
**Files:** `components/Navbar.tsx`, `components/Footer.tsx`  
**Symptom:** Admin saves contact info in Settings page but Navbar/Footer still show old hardcoded values.

**Fix — in `components/Footer.tsx` (client component):**
```typescript
const [settings, setSettings] = useState({ email: "admin@gopuexports.com", phone: "+91 87128 16876" });

useEffect(() => {
  fetch("/api/site-settings?key=contact")
    .then(r => r.json())
    .then(d => { if (d.value) setSettings(d.value); });
}, []);
```
Replace hardcoded strings with `settings.email`, `settings.phone`, etc.

---

## BUG-008 — ProductsPreview Shows Hardcoded Products

**Severity:** 🟡 Medium  
**File:** `components/ProductsPreview.tsx`  
**Symptom:** Hardcoded references to "red-chilli", "turmeric", "basmati-rice" slugs. If these are renamed or deleted, component breaks.

**Fix:** Fetch from API:
```typescript
const [products, setProducts] = useState([]);
useEffect(() => {
  fetch("/api/products?featured=true&active=true")
    .then(r => r.json())
    .then(d => setProducts(d.slice(0, 3)));
}, []);
```

---

## BUG-009 — StatsStrip Has Fake Business Statistics

**Severity:** 🟡 Medium  
**File:** `components/StatsStrip.tsx`  
**Symptom:** Shows "50+ Countries", "1500+ Shipments", "10+ Years", "100% Support" — none backed by real data.

**Decision required:** Are these intentional marketing claims or should they be real?
- If marketing claims: document as intentional, no fix needed
- If should be real: replace with computed values from DB

---

## BUG-010 — `HeroEnterprise.tsx` Is Dead Code

**Severity:** 🟢 Low  
**File:** `components/HeroEnterprise.tsx`  
**Symptom:** This component is imported nowhere. It exists but is never used.

**Fix:** Delete the file.

---

## BUG-011 — `Inquirytable.tsx` Is an Empty Stub

**Severity:** 🟢 Low  
**File:** `components/dashboard/Inquirytable.tsx`  
**Symptom:** File exists but appears to be a placeholder that was never completed. The inquiry table in the dashboard is implemented inline in `app/dashboard/inquiries/page.tsx`.

**Fix:** Either complete the component and refactor the page to use it, or delete the file.

---

## BUG-012 — No TypeScript Strict Validation on API Inputs

**Severity:** 🟡 Medium  
**Files:** All `app/api/*/route.ts` files  
**Symptom:** API handlers call `await req.json()` and directly pass the result to Mongoose. No field validation means:
- Malformed data can enter the database
- Required field errors bubble up as unhandled 500 errors

**Fix:** Add Zod validation:
```typescript
import { z } from "zod";

const InquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  // ...
});

const body = InquirySchema.safeParse(await req.json());
if (!body.success) return NextResponse.json({ error: body.error }, { status: 400 });
```

---

## BUG-013 — Session Token Has No Server-Side Expiry

**Severity:** 🟢 Low  
**File:** `lib/auth.ts`  
**Symptom:** The HMAC token itself never expires — only the cookie's `maxAge` does (client-side). If someone captures the cookie value, they can use it indefinitely until `SESSION_SECRET` is changed.

**Fix (optional hardening):** Embed timestamp in signed payload:
```typescript
const PAYLOAD = `gopu-exports-admin-v1:${Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7))}`; // changes weekly
```
This makes tokens automatically invalid after ~7 days even if the cookie is stolen.

---

## Quick-Fix Priority Queue

| # | Bug | Time to Fix | Effort |
|---|---|---|---|
| 1 | BUG-001: Connect MongoDB Atlas | 30 min | Low |
| 2 | BUG-002: Auth guard on upload | 5 min | Trivial |
| 3 | BUG-003: Gallery page 404 | 15 min | Low (stub) |
| 4 | BUG-004: Blog public pages | 3–4 hours | Medium |
| 5 | BUG-005: Real chart data | 4–6 hours | Medium |
| 6 | BUG-006: Real dashboard stats | 2 hours | Low |
| 7 | BUG-007: Settings → Navbar/Footer | 3–4 hours | Medium |
| 8 | BUG-008: Dynamic ProductsPreview | 1 hour | Low |
