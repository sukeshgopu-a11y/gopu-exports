# ADMIN PANEL DOCUMENTATION

> Supabase migration note, May 2026: dashboard authentication and dashboard data now use Supabase Auth and Supabase PostgreSQL. Any older references in this document to MongoDB, Mongoose, `ADMIN_EMAIL`, or `ADMIN_PASSWORD` are historical and are superseded by `docs/DATABASE.md` and `supabase/schema.sql`.
## GOPU Exports — Dashboard System Reference

---

### Overview

The admin panel lives at `/dashboard/*` and is a fully client-side rendered CMS built with React, Tailwind CSS, and Lucide icons. It allows the business owner to manage all dynamic website content without touching code.

**Access URL:** `http://yourdomain.com/dashboard`  
**Login URL:** `http://yourdomain.com/dashboard/login`

---

### Authentication System

#### How It Works

1. Admin navigates to `/dashboard/login`
2. Submits email + password via form (POST to `/api/auth/login`)
3. Server validates against `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
4. If valid: creates HMAC-SHA256 signed token, stores in httpOnly cookie (`admin-session`, 7 days)
5. Subsequent requests: `proxy.ts` intercepts all `/dashboard/*` routes, reads cookie, verifies token
6. If token invalid or missing: redirect to `/dashboard/login`
7. Logout: POST to `/api/auth/logout` clears the cookie

#### Key Files

| File | Purpose |
|---|---|
| `lib/auth.ts` | `createSessionToken()`, `verifySessionToken()`, `COOKIE_NAME` constant |
| `lib/adminAuth.ts` | `isAdmin()` (reads cookie in API routes), `unauthorized()` |
| `app/api/auth/login/route.ts` | Validates credentials, sets cookie |
| `app/api/auth/logout/route.ts` | Clears cookie |
| `proxy.ts` | Middleware — protects all `/dashboard/*` routes |

#### Security Notes

- Token is HMAC-SHA256 of a fixed payload (`"gopu-exports-admin-v1"`) signed with `SESSION_SECRET`
- This means ALL valid sessions produce the same token — there is NO per-user session differentiation
- The system supports only ONE admin (no roles, no multi-user)
- `SESSION_SECRET` defaults to `"change-this-secret"` — **must be changed in production**
- `ADMIN_PASSWORD` defaults to `"admin123"` — **must be changed in production**

---

### Dashboard Layout

```
/dashboard/layout.tsx
├── Sidebar (left) — navigation
├── Topbar (top) — search + user info
└── {children} — page content area
```

`ConditionalLayout.tsx` in the root layout detects `/dashboard` routes and hides the public Navbar and Footer.

---

### Dashboard Pages

#### `/dashboard` — Home / Analytics

**File:** `app/dashboard/page.tsx`

**What it shows:**
- 4 stat cards: Total Inquiries, Total Products, Export Markets (hardcoded: 18), Response Rate (hardcoded: 100%)
- Recent Inquiries table (real data from MongoDB)
- Quick action links

**⚠️ Issues:**
- "Export Markets" count (18) is hardcoded — not from DB
- "Response Rate" (100%) is fake — no tracking exists
- Monthly inquiry chart (`InquiryChart.tsx`) uses hardcoded January–December data

---

#### `/dashboard/products` — Product Management

**File:** `app/dashboard/products/page.tsx`

**Features:**
- Full data table with search
- Add new product (modal form)
- Edit existing product (modal form)
- Toggle active/inactive status
- Delete product (with confirm dialog)
- **Seed from Library** button — triggers `POST /api/admin/seed` to import `lib/products.ts`

**Form fields organized in sections:**
1. Basic Info: slug, title, tagline, category, description, short description
2. Trade Info: origin, MOQ, packaging, lead time, HS code, shelf life, container capacity
3. Media: image URL, gallery URLs (one per line)
4. Specifications: dynamic key-value spec rows
5. Export Information: countries, ports (one per line)
6. Certifications & Applications: certifications, applications, benefits (one per line)
7. Related Products: slugs (one per line)
8. SEO: meta title, meta description, keywords (comma-separated)
9. Settings: featured checkbox, active checkbox

**⚠️ Issues:**
- Image field is a URL text input — no file picker / upload button
- Array fields (applications, benefits, etc.) use newline-separated textarea — UX is poor
- No bulk operations

---

#### `/dashboard/inquiries` — Inquiry Management

**File:** `app/dashboard/inquiries/page.tsx`

**Features:**
- Table of all submitted inquiries
- Status badge display (New, Pending, Replied, Closed)
- Click row to view full inquiry details
- Update inquiry status
- Delete inquiry

**⚠️ Issues:**
- No CSV/Excel export
- No email reply functionality
- No search or filter by status
- No pagination (all inquiries load at once)

---

#### `/dashboard/categories` — Category Management

**File:** `app/dashboard/categories/page.tsx`

**Features:**
- List all categories
- Add/edit category (name, slug, description, image URL, order)
- Auto-generates slug from name
- Toggle active/inactive
- Delete category

**⚠️ Issues:**
- Categories in `lib/products.ts` (static data) don't match DB categories — mismatch until seeded
- No reordering drag-and-drop

---

#### `/dashboard/certifications` — Certification Management

**File:** `app/dashboard/certifications/page.tsx`

**Features:**
- List with logo preview
- Add/edit certification (name, issuer, logo URL, description, order)
- Quick-add preset buttons when DB is empty: APEDA, Spice Board, FSSAI, IEC, GST, ISO 22000, HACCP, ORGANIC INDIA
- Toggle active/inactive
- Delete

**⚠️ Issues:**
- Logo is a URL — no upload UI
- Quick-add presets don't auto-populate description/issuer

---

#### `/dashboard/blogs` — Blog Management

**File:** `app/dashboard/blogs/page.tsx`

**Features:**
- List all posts with draft/published status
- Full form: title, slug (auto), author, image URL, excerpt, content (markdown text), tags, published toggle, meta title, meta description
- Toggle published/draft from table
- Delete post

**⚠️ Issues:**
- No rich text / markdown preview editor (plain textarea)
- No public blog listing page (`/blog`) exists
- No public blog detail page (`/blog/[slug]`) exists
- Published posts are not accessible to website visitors

---

#### `/dashboard/settings` — Site Settings

**File:** `app/dashboard/settings/page.tsx`

**Features:**
- Load/save company contact information
- Fields: company name, email, phone, WhatsApp, website, IEC number, address, LinkedIn, Instagram, Facebook
- Persists to MongoDB via `SiteSettings` model (key: `"contact"`)

**⚠️ Issues:**
- Only "contact" settings key is implemented
- Homepage text, footer text, SEO defaults — no UI for these
- Settings changes do NOT auto-update the live website (the Navbar/Footer hardcode the contact info — they don't fetch from DB)

---

#### `/dashboard/gallery` — Gallery Management

**Status: ❌ MISSING**  
The sidebar has a "Gallery" link but no page exists at this route. Clicking it will 404 or show an error.

---

### Admin Sidebar Navigation

**File:** `components/dashboard/Sidebar.tsx`

| Link | Route | Status |
|---|---|---|
| Dashboard | /dashboard | ✅ |
| Inquiries | /dashboard/inquiries | ✅ |
| Products | /dashboard/products | ✅ |
| Categories | /dashboard/categories | ✅ |
| Certifications | /dashboard/certifications | ✅ |
| Blogs | /dashboard/blogs | ✅ |
| Gallery | /dashboard/gallery | ❌ Page missing |
| Settings | /dashboard/settings | ✅ |

---

### How Admin Changes Affect the Website

| Admin Action | How It Updates Website |
|---|---|
| Add/edit product | Immediately visible on /products and /products/[slug] via ISR (60s cache) |
| Toggle product active | Hides/shows product within 60 seconds |
| Mark product featured | Appears in homepage "Featured Products" within 60 seconds |
| Add certification | Appears on /certifications page within 60 seconds |
| Update inquiry status | Only visible in admin — no public-facing effect |
| Save settings | **Does NOT update website** — Navbar/Footer are hardcoded |
| Publish blog post | **Not visible anywhere** — no public blog pages |
| Gallery changes | **Not connected** — gallery page is hardcoded |

**ISR (Incremental Static Regeneration)**: Pages with `export const revalidate = 60` are cached for 60 seconds and automatically regenerate. This means product/certification changes are visible to website visitors within 1 minute.

---

### Image Upload System

**API route:** `POST /api/upload`  
**Storage:** Supabase Storage bucket (`gallery` by default)

**How it works:**
1. Client sends `FormData` with `file` and optional `bucket` fields
2. Server uses Supabase admin client to upload
3. Returns public URL

**⚠️ Status: Backend works; NO frontend UI**  
Product forms, certification forms, and blog forms all have URL text inputs. There is no file picker or "Upload Image" button wired up in any dashboard page. Admins must manually upload to Supabase and paste the URL.

**Required work:** Add upload button + `<input type="file">` to each admin form, calling `/api/upload` on change, then populating the URL field.
