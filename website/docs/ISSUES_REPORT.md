# ISSUES REPORT
## GOPU Exports — Bugs, Incomplete Features & Technical Debt

---

### Severity Legend
- 🔴 **Critical** — Blocks core functionality; must fix before launch
- 🟠 **High** — Significant user/business impact
- 🟡 **Medium** — Noticeable issue; fix before launch
- 🟢 **Low** — Minor; can defer

---

## CRITICAL ISSUES

### 🔴 MongoDB Not Connected — Site Cannot Load Dynamic Content

**Status:** Database not running  
**Impact:** Products page shows loading skeletons forever; homepage shows no featured products; certifications page falls back to hardcoded data; all admin CRUD operations fail

**Root cause:** `MONGODB_URI` in `.env.local` points to `mongodb://127.0.0.1:27017/gopu-exports` but MongoDB Community Server is not installed on the development machine.

**Fix:**
1. Create MongoDB Atlas free cluster
2. Update `MONGODB_URI` in `.env.local` with Atlas connection string
3. Restart dev server
4. Run seed from admin dashboard

---

### 🔴 Database Is Empty — No Products in MongoDB

**Status:** Even after connecting Atlas, products must be seeded  
**Impact:** `/products` page is empty; homepage featured products section is empty

**Fix:** After connecting MongoDB, log in to admin → Products → click "Seed from Library" or "Import from Product Library"

---

### 🔴 `/api/upload` Route Has No Authentication

**File:** `app/api/upload/route.ts`  
**Impact:** Any anonymous user can POST to this endpoint and upload unlimited files to the Supabase Storage bucket — a security and cost risk.

**Fix:** Add `isAdmin()` check at the top:
```typescript
import { isAdmin, unauthorized } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  // ... rest of handler
}
```

---

## HIGH ISSUES

### 🟠 Gallery Dashboard Page Missing (404)

**File:** Missing — `app/dashboard/gallery/page.tsx` does not exist  
**Sidebar link:** `components/dashboard/Sidebar.tsx` has a "Gallery" nav item pointing to `/dashboard/gallery`  
**Impact:** Clicking Gallery in admin sidebar throws a Next.js 404 or unhandled route error

**Fix:** Create `app/dashboard/gallery/page.tsx` — can display uploaded images from Supabase and allow deletion

---

### 🟠 Blog Posts Have No Public Pages

**Files:** Missing — `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` do not exist  
**Impact:** Blog posts created in the admin are published into a void — visitors cannot read them. The blog CMS feature is 100% non-functional from a visitor perspective.

**Fix:** Create both pages:
- `app/blog/page.tsx` — list published blogs (fetch from `/api/blogs?published=true`)
- `app/blog/[slug]/page.tsx` — render individual post (fetch from `/api/blogs/[slug]`)

---

### 🟠 No Email Notification for New Inquiries

**Impact:** When a customer submits the contact/enquiry form, no email is sent to the admin. The only way to know an inquiry arrived is to manually check the dashboard. High risk of missing leads.

**Fix:** Integrate an email service in `app/api/inquiries/route.ts` POST handler:
- **Recommended:** [Resend](https://resend.com) (free tier: 3,000 emails/month)
- Alternative: Nodemailer + SMTP

---

### 🟠 Image Upload Not Wired to Dashboard Forms

**Impact:** Product, certification, and blog forms only accept image URLs typed manually. Admins must upload images separately to Supabase and paste URLs — extremely poor UX.

**Fix:** Add `<input type="file">` and upload button to each admin form. On file select, POST to `/api/upload`, receive URL, and auto-populate the URL field.

---

### 🟠 Navbar/Footer Contact Info is Hardcoded

**File:** `components/Navbar.tsx`, `components/Footer.tsx`  
**Impact:** The Settings page saves company info to MongoDB (`SiteSettings` model), but the Navbar and Footer display hardcoded values. Changing settings in admin has zero effect on the website.

**Fix:** Convert Navbar and Footer to fetch from `/api/site-settings?key=contact` on mount (client) or pass data from server layout.

---

### 🟠 Dashboard Analytics Are Partially Fake

**File:** `components/dashboard/InquiryChart.tsx`  
**Impact:** The monthly inquiry bar chart shows completely fake hardcoded data (made-up numbers for Jan–Dec). This is misleading and worthless for business decisions.

**File:** `app/dashboard/page.tsx`  
**Impact:** "Export Markets" count shows hardcoded `18`. "Response Rate" shows hardcoded `100%`.

**Fix:**
- Chart: query MongoDB to count inquiries grouped by month (`$group` aggregate)
- Export Markets: count distinct `country` field values in inquiries
- Response Rate: either remove or calculate from replied/closed vs total

---

## MEDIUM ISSUES

### 🟡 `ProductsPreview.tsx` Component Has Hardcoded Product References

**File:** `components/ProductsPreview.tsx`  
**Impact:** Shows exactly 3 hardcoded products (Red Chilli, Turmeric, Basmati Rice). After seeding, these products exist, but if slugs change or products are deleted, this component breaks visually.

**Fix:** Replace hardcoded product references with a fetch from `/api/products?featured=true&limit=3`

---

### 🟡 `StatsStrip.tsx` Has Hardcoded Statistics

**File:** `components/StatsStrip.tsx`  
**Hardcoded values:** "50+ Countries", "1500+ Shipments", "10+ Years", "100% Support"  
**Impact:** These are marketing claims with no backing data. The "50+ Countries" claim is particularly risky if audited.

**Fix:** Either:
1. Keep as marketing claims but clearly document them as intentional
2. Replace with real computed values (e.g. count distinct inquiry countries)

---

### 🟡 Gallery Page Has Hardcoded Images

**File:** `app/gallery/page.tsx`  
**Impact:** Gallery shows 9 hardcoded image URLs (mix of local files and Unsplash). Not editable from admin panel. Adding/removing images requires code changes.

**Fix:** Fetch image list from Supabase Storage bucket via API, or create a `Gallery` MongoDB model and manage via admin.

---

### 🟡 No Form Validation Library

**Impact:** All forms (contact, admin) use native HTML validation only. No schema validation (Zod), no server-side input sanitization. Risk of XSS, injection, or malformed data in MongoDB.

**Fix:** Add Zod for server-side validation in all API route POST/PATCH handlers.

---

### 🟡 No Rate Limiting on Public Forms

**Impact:** The contact/inquiry form (`POST /api/inquiries`) has no rate limiting. A bot can spam thousands of fake inquiries.

**Fix:** Add Vercel's `@vercel/kv` rate limiting, or a simple in-memory counter, or use a CAPTCHA (hCaptcha / Cloudflare Turnstile).

---

### 🟡 No Pagination on Admin Inquiry List

**File:** `app/dashboard/inquiries/page.tsx`  
**Impact:** All inquiries load at once. Will degrade performance as inquiry count grows past 100+.

**Fix:** Add server-side pagination with `?page=1&limit=25` query params to the GET `/api/inquiries` route.

---

### 🟡 `HeroEnterprise.tsx` Component Is Unused

**File:** `components/HeroEnterprise.tsx`  
**Impact:** Dead code — imported nowhere. Adds confusion for new developers.

**Fix:** Delete the file, or document why it was kept as a variant.

---

### 🟡 `components/dashboard/Inquirytable.tsx` Is Empty/Minimal

**File:** `components/dashboard/Inquirytable.tsx`  
**Impact:** Appears to be a stub component that was never completed. The inquiry table in `/dashboard/inquiries` is likely built inline in the page file instead.

**Fix:** Either complete the component and use it, or delete the file.

---

### 🟡 No Sitemap or robots.txt

**Impact:** Search engines may not efficiently index the site. Missing `sitemap.xml` means new pages (products, certifications) may take weeks to appear in Google.

**Fix:**
- Create `app/sitemap.ts` (Next.js static sitemap generation)
- Create `public/robots.txt`

---

## LOW ISSUES

### 🟢 Session Token Has No Expiry in Token Itself

**File:** `lib/auth.ts`  
**Impact:** The HMAC token has no embedded expiry — it's valid forever unless `SESSION_SECRET` is changed. The 7-day expiry is only enforced by the cookie's `maxAge`, which is a client-side control.

**Risk:** Low — the httpOnly cookie cannot be read by JS, so token theft requires physical cookie access.

**Fix (optional):** Embed a timestamp in the HMAC payload and reject tokens older than 7 days server-side.

---

### 🟢 `enquiry/page.tsx` Redirect

**File:** `app/enquiry/page.tsx`  
**Impact:** Appears to be an old route redirect. Verify if this is intentional or a leftover.

---

### 🟢 No Error Boundaries

**Impact:** If a server component throws (e.g. MongoDB query fails), the entire page may crash with an unhandled error. Next.js does have default error handling, but no custom `error.tsx` files exist.

**Fix:** Add `app/error.tsx` and per-section `error.tsx` files for graceful degradation.

---

### 🟢 Supabase Database Credentials Exist but Unused

**File:** `.env.local`  
**Issue:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` suggest the project started with Supabase as the database. The project then switched to MongoDB/Mongoose. The Supabase client is now only used for file storage.

**Impact:** Low — just cleanup. Ensure no code accidentally uses Supabase DB (Postgres) instead of MongoDB.

---

### 🟢 `app/about/page.tsx` — All Content is Hardcoded

**Impact:** Company story, values, and operational strengths cannot be edited from admin. Requires code changes to update.

**Fix:** Add a SiteSettings key for about page content, or create an About CMS page in admin.

---

## TypeScript / Build Issues

| File | Issue |
|---|---|
| `components/dashboard/InquiryChart.tsx` | Likely has implicit `any` types on chart data |
| `app/dashboard/products/page.tsx` | Complex type casting between `Product` and `ProductDB` types |
| API route handlers | No return type annotations |

Run `npx tsc --noEmit` to get the full list of TypeScript errors before deploying.

---

## Summary Count

| Severity | Count |
|---|---|
| 🔴 Critical | 3 |
| 🟠 High | 6 |
| 🟡 Medium | 8 |
| 🟢 Low | 5 |
| **Total** | **22** |
# Supabase Migration Note

MongoDB-specific issues are historical. The active database blocker is Supabase setup: apply `supabase/schema.sql`, set valid Supabase keys, and create an admin Auth user mapped in `admin_users`.
