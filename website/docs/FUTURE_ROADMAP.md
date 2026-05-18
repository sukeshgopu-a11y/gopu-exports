# FUTURE DEVELOPMENT ROADMAP
## GOPU Exports — Prioritized Feature Backlog

---

## Phase 1 — Make It Launch-Ready (1–2 weeks)

These are blockers or near-blockers for a production launch.

### P1.1 — Connect MongoDB Atlas *(Critical)*
- Set up Atlas free cluster
- Update `MONGODB_URI` in `.env.local` and hosting platform
- Seed products via admin dashboard
- **Effort:** 1 hour

### P1.2 — Secure the Upload API *(Critical)*
- Add `isAdmin()` check to `app/api/upload/route.ts`
- **Effort:** 5 minutes

### P1.3 — Change Default Admin Credentials *(Critical)*
- Set strong `ADMIN_PASSWORD` and `SESSION_SECRET` in `.env.local`
- **Effort:** 5 minutes

### P1.4 — Create Blog Public Pages *(High)*
- `app/blog/page.tsx` — list published posts
- `app/blog/[slug]/page.tsx` — individual post view
- Add `/blog` link to Navbar
- **Effort:** 3–4 hours

### P1.5 — Create Gallery Dashboard Page *(High)*
- `app/dashboard/gallery/page.tsx` — list Supabase Storage images
- Allow delete + copy URL
- **Effort:** 3–4 hours

### P1.6 — Wire Image Upload Into Dashboard Forms *(High)*
- Add file picker button to product, certification, blog forms
- On selection: POST to `/api/upload`, get URL, auto-fill URL field
- **Effort:** 4–6 hours

### P1.7 — Email Notification on Inquiry Submission *(High)*
- Install Resend: `npm install resend`
- Add `RESEND_API_KEY` to `.env.local`
- Send email to admin when `POST /api/inquiries` is called
- **Effort:** 2–3 hours

### P1.8 — Fix Navbar/Footer to Use Settings *(High)*
- Fetch company contact info from `/api/site-settings?key=contact`
- Update Navbar and Footer to use dynamic data
- **Effort:** 3–4 hours

---

## Phase 2 — Polish & Reliability (2–4 weeks)

### P2.1 — Replace Hardcoded Dashboard Analytics *(High)*
- Dashboard home: real inquiry count per month using MongoDB aggregate
- Remove hardcoded "18 markets" and "100% response rate"
- Replace `InquiryChart.tsx` hardcoded data with real monthly counts
- **Effort:** 4–6 hours

### P2.2 — Input Validation with Zod *(Medium)*
- Add Zod schemas for all API route POST/PATCH handlers
- Validate: `POST /api/inquiries`, `POST /api/products`, etc.
- Return structured 400 errors on validation failure
- **Effort:** 6–8 hours

### P2.3 — Inquiry CSV Export *(Medium)*
- Add export button to `/dashboard/inquiries`
- GET `/api/inquiries?format=csv` returns CSV file
- **Effort:** 2–3 hours

### P2.4 — Rate Limiting on Contact Form *(Medium)*
- Add Cloudflare Turnstile or hCaptcha to contact form
- Or server-side rate limit by IP using Upstash Redis
- **Effort:** 3–5 hours

### P2.5 — Pagination for Inquiry List *(Medium)*
- Add `?page=X&limit=25` support to `GET /api/inquiries`
- Update admin inquiry table with next/prev controls
- **Effort:** 3–4 hours

### P2.6 — Sitemap + robots.txt *(Medium)*
- Create `app/sitemap.ts` — generates XML sitemap dynamically from MongoDB product slugs
- Create `public/robots.txt`
- **Effort:** 2 hours

### P2.7 — Error Boundaries *(Medium)*
- Create `app/error.tsx` for top-level error handling
- Create `app/dashboard/error.tsx` for dashboard errors
- **Effort:** 1–2 hours

### P2.8 — Gallery Admin → Gallery Public *(Medium)*
- Create admin gallery page (Phase 1)
- Create public `/gallery` page that fetches from Supabase Storage instead of hardcoded list
- **Effort:** 3–4 hours

### P2.9 — Remove Dead Code *(Low)*
- Delete `components/HeroEnterprise.tsx` (unused)
- Clean up `components/dashboard/Inquirytable.tsx` (empty stub)
- Verify `app/enquiry/page.tsx` redirect is intentional
- **Effort:** 30 minutes

---

## Phase 3 — Growth Features (1–3 months)

### P3.1 — Product Search (Full-Text)
- Enable MongoDB Atlas Search on the `products` collection
- Replace basic JS filtering in `ProductsGrid.tsx` with Atlas Search API calls
- Add search suggestions / typeahead
- **Effort:** 1–2 days

### P3.2 — Blog with Categories and Tags
- Tag-based filtering on `/blog`
- Related posts section on `/blog/[slug]`
- Blog sitemap entries
- **Effort:** 1–2 days

### P3.3 — Product Inquiry (Per-Product)
- "Request Quote" button on product detail page pre-fills product name in the contact form
- Or inline mini-form that POSTs to `/api/inquiries` directly
- **Effort:** 4–6 hours

### P3.4 — Homepage CMS
- Add admin UI for editing homepage hero text, tagline, stats
- Store in `SiteSettings` with key `"homepage"`
- Homepage server component fetches and renders
- **Effort:** 1–2 days

### P3.5 — About Page CMS
- Add admin UI for about page content
- Store in `SiteSettings` with key `"about"`
- **Effort:** 1–2 days

### P3.6 — WhatsApp Chat Integration (Improved)
- Replace the simple `wa.me` link with a proper WhatsApp widget (e.g. Tawk.to or a dedicated WhatsApp Business API widget)
- Track conversations
- **Effort:** 4–8 hours

### P3.7 — Google Analytics / Tag Manager
- Add GA4 or GTM to `app/layout.tsx`
- Track: page views, contact form submissions, WhatsApp clicks, product views
- **Effort:** 2–4 hours

### P3.8 — CRM Integration
- Automatically create lead in CRM (HubSpot, Zoho, Salesforce) when inquiry is submitted
- Use webhooks from `/api/inquiries` POST handler
- **Effort:** 1–2 days

---

## Phase 4 — Performance & Scalability

### P4.1 — Image Optimization
- Replace Unsplash placeholder images with actual product photography hosted on Supabase or Cloudinary
- Use `next/image` with proper `width` and `height` on all images
- Add `placeholder="blur"` for loading states
- **Effort:** Ongoing

### P4.2 — Caching Strategy
- Review `revalidate` values (currently 60s on all dynamic pages)
- Use `revalidateTag` for on-demand revalidation when admin saves a product
- **Effort:** 4–6 hours

### P4.3 — MongoDB Indexing
- Add indexes on frequently queried fields:
  - `products`: `{ slug: 1 }`, `{ active: 1, featured: 1 }`, `{ category: 1 }`
  - `inquiries`: `{ createdAt: -1 }`, `{ status: 1 }`
- **Effort:** 1 hour

### P4.4 — SEO Improvements
- Per-product `generateMetadata()` with real data
- Per-page Open Graph images
- Structured data (JSON-LD) for products
- Breadcrumb schema markup
- **Effort:** 1–2 days

### P4.5 — Multi-Language Support (Future)
- Add language switcher (Arabic, Hindi for target markets)
- Use `next-intl` or similar i18n library
- **Effort:** 1–2 weeks

---

## Technical Debt Cleanup

| Item | Priority | Effort |
|---|---|---|
| Add Zod validation to all API routes | High | 6–8h |
| Add TypeScript return types to all API handlers | Medium | 2–3h |
| Extract admin form components into shared components | Medium | 4–6h |
| Replace plain `fetch` with SWR or React Query in admin | Low | 1–2 days |
| Add Jest / Playwright tests | Medium | 1–2 weeks |
| Move hardcoded strings to constants file | Low | 2–3h |
| Add proper logging (Pino / Winston) | Medium | 4–6h |

---

## Scalability Recommendations

1. **MongoDB Atlas** — Free M0 tier is fine up to ~500MB data. Upgrade to M10 ($57/month) when approaching limits.

2. **Vercel** — Hobby tier is free for small traffic. Upgrade to Pro ($20/month) for commercial use (required by Vercel ToS for business sites).

3. **Supabase Storage** — Free tier: 1GB storage, 2GB bandwidth. Upgrade as image library grows.

4. **CDN for Images** — Once real product photos are added, use Cloudinary or Supabase's CDN (already configured in `next.config.ts`) for image optimization.

5. **Connection Pooling** — Mongoose's singleton connection in `lib/mongodb.ts` is correct for serverless. No changes needed.

6. **Search at Scale** — If product catalog grows to 200+, consider MongoDB Atlas Search for full-text search with relevance ranking instead of client-side filtering.
# Supabase Migration Note

Roadmap items mentioning MongoDB should now be interpreted as Supabase PostgreSQL work unless explicitly updated otherwise. Current database setup is documented in `docs/DATABASE.md`.
