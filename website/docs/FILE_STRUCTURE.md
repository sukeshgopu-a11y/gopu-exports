# FILE & FOLDER STRUCTURE
## GOPU Exports — Complete Project Map

---

```
website/
├── app/                          # Next.js App Router — all pages and API routes
│   ├── layout.tsx                # Root layout: metadata, ConditionalLayout wrapper
│   ├── page.tsx                  # Homepage (/)
│   ├── globals.css               # Global CSS imports (Tailwind base)
│   │
│   ├── about/
│   │   └── page.tsx              # About page (/about)
│   │
│   ├── products/
│   │   ├── page.tsx              # Products catalogue (/products) — uses ProductsGrid
│   │   └── [slug]/
│   │       └── page.tsx          # Product detail (/products/[slug]) — server component, MongoDB
│   │
│   ├── contact/
│   │   └── page.tsx              # Contact/Enquiry form (/contact) — POSTs to /api/inquiries
│   │
│   ├── enquiry/
│   │   └── page.tsx              # Redirect to /contact
│   │
│   ├── markets/
│   │   └── page.tsx              # Export Markets page (/markets)
│   │
│   ├── certifications/
│   │   └── page.tsx              # Certifications page (/certifications) — server component, MongoDB
│   │
│   ├── gallery/
│   │   └── page.tsx              # Gallery page (/gallery) — HARDCODED images, not CMS-driven
│   │
│   ├── dashboard/                # Admin panel — all routes protected by proxy.ts
│   │   ├── layout.tsx            # Dashboard layout (Sidebar + Topbar)
│   │   ├── page.tsx              # Dashboard home (/dashboard) — stats + recent inquiries
│   │   ├── login/
│   │   │   └── page.tsx          # Admin login form (/dashboard/login) — public route
│   │   ├── products/
│   │   │   └── page.tsx          # Product management CRUD
│   │   ├── categories/
│   │   │   └── page.tsx          # Category management CRUD
│   │   ├── certifications/
│   │   │   └── page.tsx          # Certification management CRUD
│   │   ├── blogs/
│   │   │   └── page.tsx          # Blog post management CRUD
│   │   ├── inquiries/
│   │   │   └── page.tsx          # Inquiry management + status changes
│   │   └── settings/
│   │       └── page.tsx          # Site settings (company contact info)
│   │
│   └── api/                      # Backend API routes
│       ├── auth/
│       │   ├── login/route.ts    # POST — validates credentials, sets cookie
│       │   └── logout/route.ts   # POST — clears session cookie
│       ├── products/
│       │   ├── route.ts          # GET (public) + POST (admin)
│       │   └── [id]/route.ts     # GET by id/slug + PATCH + DELETE (admin)
│       ├── inquiries/
│       │   ├── route.ts          # GET (admin) + POST (public)
│       │   └── [id]/route.ts     # PATCH + DELETE (admin)
│       ├── categories/
│       │   ├── route.ts          # GET (public) + POST (admin)
│       │   └── [id]/route.ts     # PATCH + DELETE (admin)
│       ├── certifications/
│       │   ├── route.ts          # GET (public) + POST (admin)
│       │   └── [id]/route.ts     # PATCH + DELETE (admin)
│       ├── blogs/
│       │   ├── route.ts          # GET (public) + POST (admin)
│       │   └── [id]/route.ts     # GET by id/slug + PATCH + DELETE (admin)
│       ├── site-settings/
│       │   └── route.ts          # GET (public) + PUT (admin)
│       ├── upload/
│       │   └── route.ts          # POST — Supabase Storage file upload (admin)
│       └── admin/
│           └── seed/route.ts     # POST (admin) — import lib/products.ts to MongoDB
│
├── components/                   # Reusable React components
│   ├── Button.tsx                # Reusable CTA button (Next.js Link wrapper)
│   ├── Container.tsx             # Max-width responsive container
│   ├── ConditionalLayout.tsx     # Hides Navbar/Footer on /dashboard routes
│   ├── TopBar.tsx                # Contact info header bar
│   ├── Navbar.tsx                # Main navigation (logo, links, mobile menu)
│   ├── Footer.tsx                # Site footer with quick enquiry form
│   ├── Hero.tsx                  # Homepage hero section
│   ├── HeroEnterprise.tsx        # Alternative hero variant (not in active use)
│   ├── ProductsPreview.tsx       # 3-product featured preview (HARDCODED products)
│   ├── ProductsGrid.tsx          # Products catalogue grid (fetches from /api/products)
│   ├── ProductCategories.tsx     # Category cards grid
│   ├── CTABanner.tsx             # Call-to-action banner
│   ├── CTASection.tsx            # Alternative CTA section
│   ├── StatsStrip.tsx            # Stats bar (HARDCODED: 50 countries, 1500 shipments)
│   ├── TrustSection.tsx          # 4-point trust section
│   ├── WhyChooseUs.tsx           # Feature cards section
│   ├── ExportMarkets.tsx         # Export markets section
│   └── dashboard/
│       ├── Sidebar.tsx           # Admin navigation sidebar
│       ├── Topbar.tsx            # Admin top bar (search, profile)
│       ├── StatCard.tsx          # Stat display card
│       ├── InquiryChart.tsx      # Monthly inquiries bar chart (HARDCODED data)
│       └── Inquirytable.tsx      # Inquiry table component (minimal/empty)
│
├── lib/                          # Utility functions and configurations
│   ├── mongodb.ts                # MongoDB connection singleton (connectDB)
│   ├── auth.ts                   # HMAC token create/verify + COOKIE_NAME constant
│   ├── adminAuth.ts              # isAdmin() helper + unauthorized() response
│   ├── supabase.ts               # Supabase client (browser) + admin client (server)
│   └── products.ts               # Static product data (17 products) — source of truth for seed
│
├── models/                       # Mongoose schemas
│   ├── Product.ts                # Product schema (full export product data)
│   ├── Category.ts               # Category schema
│   ├── Certification.ts          # Certification schema
│   ├── Blog.ts                   # Blog post schema
│   ├── Inquiry.ts                # Customer inquiry schema
│   └── SiteSettings.ts           # Key-value site settings schema
│
├── public/                       # Static assets (served at /)
│   ├── images/
│   │   ├── hero-bg.jpg           # Homepage hero background
│   │   ├── hero-export.jpg       # Alternative hero image
│   │   └── cta-ship.jpg          # CTA section shipping image
│   ├── products/
│   │   ├── red-chilli.jpg
│   │   ├── rice.jpg
│   │   └── turmeric.jpg
│   ├── logos/
│   │   ├── logo.png
│   │   └── logo-icon.png
│   └── world-map.png
│
├── docs/                         # Developer documentation (this folder)
│
├── proxy.ts                      # Next.js 16 route protection (replaces middleware.ts)
├── next.config.ts                # Next.js config (image remote patterns)
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── .env.local                    # Environment variables (NOT committed to git)
├── CLAUDE.md                     # AI assistant instructions (references AGENTS.md)
└── AGENTS.md                     # AI coding agent rules for this project
```

---

### Key File Relationships

```
proxy.ts
  └── imports: lib/auth.ts (verifySessionToken, COOKIE_NAME)
  └── protects: all /dashboard/* routes except /dashboard/login

app/layout.tsx
  └── uses: ConditionalLayout.tsx
              └── conditionally renders: Navbar.tsx, Footer.tsx
              └── hides both on: /dashboard/* routes

app/page.tsx (homepage)
  └── server component — imports: connectDB, ProductModel
  └── fetches: featured products from MongoDB
  └── renders: Hero, WhyChooseUs, StatsStrip, CTABanner

app/products/page.tsx
  └── renders: ProductsGrid.tsx (client component)
                └── fetches: GET /api/products?active=true
                └── filters: category, search query

app/products/[slug]/page.tsx
  └── server component — imports: connectDB, ProductModel
  └── fetches: single product by slug + related products

app/certifications/page.tsx
  └── server component — imports: connectDB, CertificationModel
  └── falls back to: FALLBACK_CERTS array if DB empty

app/contact/page.tsx
  └── POSTs to: /api/inquiries (creates Inquiry in MongoDB)

app/api/admin/seed/route.ts
  └── imports: lib/products.ts (PRODUCTS array)
  └── creates: ProductModel documents in MongoDB

app/dashboard/*/page.tsx
  └── all fetch from their respective /api/* routes
  └── all protected by: proxy.ts

lib/adminAuth.ts
  └── imports: lib/auth.ts
  └── used by: all admin API routes (POST/PATCH/DELETE)

models/*.ts
  └── all imported by: their respective /api/* route handlers
  └── all use: lib/mongodb.ts (connectDB)
```

---

### Files That Contain Hardcoded / Fake Data

| File | What Is Hardcoded |
|---|---|
| `components/StatsStrip.tsx` | "50+ Countries", "1500+ Shipments", "10+ Years", "100% Support" |
| `components/ProductsPreview.tsx` | 3 specific products (Red Chilli, Turmeric, Basmati Rice) |
| `components/dashboard/InquiryChart.tsx` | Monthly inquiry data (Jan–Dec fake numbers) |
| `app/gallery/page.tsx` | 9 product image cards with hardcoded URLs |
| `app/about/page.tsx` | All company story, history, values text |
| `app/markets/page.tsx` | All market regions, countries, documentation lists |
| `app/certifications/page.tsx` | FALLBACK_CERTS array (used when DB is empty) |
| `lib/products.ts` | Full static product catalog (17 products) — seed source |
# Supabase Migration Note

Backend data access now lives in `src/lib/supabase/` and Supabase-backed API routes. Older MongoDB/Mongoose paths in this file are historical.
