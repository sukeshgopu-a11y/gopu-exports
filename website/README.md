# GOPU Exports Production Website

Production Next.js website and admin dashboard for GOPU Exports, an Indian agricultural export business. The platform supports public product discovery, buyer enquiry flows, quote handling, Supabase-backed dashboard management, email notifications, storage uploads, SEO metadata, and production security controls.

## Tech Stack

- Next.js App Router with TypeScript
- React 19
- Tailwind CSS
- Supabase PostgreSQL, Auth, RLS, and Storage
- Resend transactional email
- Cloudflare Turnstile spam protection
- Sentry error monitoring
- Vercel hosting, analytics, and speed insights

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Before deployment, validate:

```bash
npm run lint
npm run build
npm audit --audit-level=high
```

## Environment Variables

Use real values only in `.env.local` and Vercel environment variables. Keep `.env.local.example` as placeholders.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser/server | Supabase project URL. Safe to expose. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser/server | Supabase anon key protected by RLS. Safe to expose. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Optional maintenance/admin key. Never import into Client Components. |
| `RESEND_API_KEY` | Server only | Sends admin lead notifications and buyer auto-replies. |
| `ADMIN_EMAIL` | Server only | Admin lead recipient. Defaults to `admin@gopuexports.com`. |
| `EMAIL_FROM` | Server only | Verified Resend sender, for example `GOPU Exports <noreply@gopuexports.com>`. |
| `TURNSTILE_SECRET_KEY` | Server only | Verifies Cloudflare Turnstile tokens. |
| `TURNSTILE_REQUIRED` | Server only | Set `true` only after the frontend site key is deployed. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser | Renders the Turnstile widget on lead forms. |
| `SENTRY_DSN` | Server only | Server and edge Sentry monitoring DSN. Optional. |
| `NEXT_PUBLIC_SENTRY_DSN` | Browser | Browser Sentry monitoring DSN. Optional. |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Build/server | Optional source map upload configuration. |
| `SENTRY_TRACES_SAMPLE_RATE` | Server only | Server trace sample rate. Defaults to `0.05`. |
| `NEXT_PUBLIC_LINKEDIN_URL` | Browser | Optional footer/header social link. Empty links are hidden. |
| `NEXT_PUBLIC_FACEBOOK_URL` | Browser | Optional footer/header social link. Empty links are hidden. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Browser | Optional footer/header social link. Empty links are hidden. |

## Security Features

- Supabase Row Level Security on public tables.
- Public users can read only public/active content and insert lead records.
- Admin dashboard routes require Supabase Auth plus `admin_users` authorization.
- Upload API validates MIME type, extension, file size, and randomized filenames.
- Lead APIs use Zod validation, honeypot checks, payload limits, rate limiting, and optional Turnstile verification.
- Security headers include HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and CSP Report-Only.
- Admin, dashboard, and API routes are marked `noindex` and excluded from the sitemap.
- Service role keys are server-only and must never use `NEXT_PUBLIC_` prefixes.

## Supabase And RLS Notes

Production tables include products, inquiries, quotes, certifications, gallery, blogs, categories, settings, analytics events, and admin users. RLS policies should keep this model:

- Public read: active products, active certifications, visible gallery/blog/category data.
- Public insert: inquiries, quotes, analytics events only.
- Admin read/write: authenticated users present in `public.admin_users`.
- Public update/delete: denied.
- Storage: product/gallery images may be publicly readable, but write/update/delete must be restricted to authenticated admins.

Apply migrations from `supabase/migrations/` and keep `supabase/schema.sql` aligned with production.

## Email / Resend Setup

1. Verify `gopuexports.com` in Resend.
2. Set `RESEND_API_KEY` in Vercel.
3. Set `ADMIN_EMAIL=admin@gopuexports.com`.
4. Set `EMAIL_FROM=GOPU Exports <noreply@gopuexports.com>` after the sender/domain is verified.
5. Use `/api/test-email` to confirm server runtime email delivery.

Lead routes save the database record first, then send email. If email fails, the lead remains saved and the dashboard stores the email failure fields for follow-up.

## Cloudflare Turnstile Setup

1. Create a Turnstile site in Cloudflare.
2. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to Vercel.
3. Add `TURNSTILE_SECRET_KEY` to Vercel.
4. Deploy with `TURNSTILE_REQUIRED=false` first and confirm the widget renders.
5. Submit test enquiries successfully.
6. Set `TURNSTILE_REQUIRED=true` after validation.

Inquiry and quote APIs accept `cf_turnstile_token`, `turnstileToken`, or `cf-turnstile-response`.

## Sentry Setup

Sentry is optional and build-safe. If no DSN is configured, the app still builds and runs.

1. Create a Sentry Next.js project.
2. Set `SENTRY_DSN` for server/edge monitoring.
3. Set `NEXT_PUBLIC_SENTRY_DSN` for browser monitoring.
4. Optional source maps: set `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN`.
5. Tune `SENTRY_TRACES_SAMPLE_RATE` as traffic grows.

The Sentry SDK is initialized in environment-gated instrumentation files and does not collect default PII.

## Product PDF Specification Generator

Product detail pages include `Download Specification`, which calls:

```text
/api/products/[slug]/specification
```

The route generates a branded PDF server-side with product name, category, HS code, origin, MOQ, packaging, shelf life, lead time, specifications, and an enquiry CTA. The API fetches active Supabase products and falls back to the local product catalog when needed.

## CSP Report-Only Review

The app currently sends CSP reports to `/api/csp-report` using `Content-Security-Policy-Report-Only`.

To move from report-only to enforced CSP:

1. Monitor Vercel function logs for `/api/csp-report`.
2. Confirm required domains are present for Supabase, Vercel Analytics, Sentry, Cloudflare Turnstile, and approved media hosts.
3. Remove or tighten any unnecessary directives.
4. In `next.config.ts`, change the header key from `Content-Security-Policy-Report-Only` to `Content-Security-Policy`.
5. Deploy, submit forms, download a product PDF, and verify no production functionality is blocked.

## Deployment Process

1. Confirm Vercel environment variables are configured for Production.
2. Run local validation:

```bash
npm install
npm run lint
npm run build
npm audit --audit-level=high
```

3. Commit and push to GitHub.
4. Deploy to Vercel production.
5. Verify:
   - `/` returns 200.
   - `/products` and product detail pages return 200.
   - `/api/products/[slug]/specification` returns a PDF.
   - `/contact` submits a lead.
   - Admin dashboard remains protected.
   - `/robots.txt` and `/sitemap.xml` are valid.

## Maintenance Checklist

- Review Supabase RLS policies after schema changes.
- Rotate API keys when staff or vendors change.
- Keep Resend domain verification healthy.
- Check Sentry issues and Vercel function logs weekly.
- Review CSP reports before enforcing new domains.
- Test lead submission and email delivery after every deployment.
- Keep product specs, MOQ wording, certifications, and company details factual.
- Run `npm audit --audit-level=high` before production releases.
