# TODO CHECKLIST
## GOPU Exports — Launch Readiness Status

Use this as the current Supabase-era launch checklist. Older MongoDB tasks are no longer applicable.

## Completed For Launch

- [x] Replace MongoDB/Mongoose runtime code with Supabase PostgreSQL.
- [x] Create and verify Supabase schema in `supabase/schema.sql`.
- [x] Enable RLS on public tables.
- [x] Add RLS policies for public reads, public form inserts, and admin-only management.
- [x] Configure local Supabase URL and anon key in `.env.local`.
- [x] Keep real secrets out of `.env.local.example`.
- [x] Create Supabase Auth admin user.
- [x] Add admin user UUID to `public.admin_users`.
- [x] Protect dashboard routes through Supabase Auth and `admin_users`.
- [x] Remove old `admin123` hardcoded login flow.
- [x] Protect admin API routes.
- [x] Protect image upload API route.
- [x] Seed products from the product library into Supabase.
- [x] Verify products are visible on `/products`.
- [x] Connect homepage featured products to Supabase.
- [x] Connect product listing and product detail pages to Supabase.
- [x] Connect inquiry form submissions to Supabase.
- [x] Verify submitted inquiry appears in admin dashboard.
- [x] Connect quote form submissions to Supabase.
- [x] Verify submitted quote appears in admin dashboard.
- [x] Connect certification admin CRUD to Supabase.
- [x] Verify certification hide/show affects public website.
- [x] Create gallery table, API routes, dashboard page, and public gallery page.
- [x] Verify gallery hide/show affects public website.
- [x] Add image upload controls to product, certification, and blog admin forms.
- [x] Replace fake dashboard stats with database-derived counts.
- [x] Replace fake inquiry chart data with zero/default real-data component behavior.
- [x] Add inquiry CSV export.
- [x] Add quote CSV export.
- [x] Create public blog listing page.
- [x] Create public blog detail page.
- [x] Add blog link to public navigation and footer.
- [x] Add dynamic sitemap generation.
- [x] Add robots rules.
- [x] Add product page metadata.
- [x] Remove unused dead components.
- [x] Verify `app/enquiry/page.tsx` redirect is intentional.
- [x] Run `npm install`.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Run `npm run dev`.
- [x] Run manual API smoke tests for auth, products, inquiries, quotes, certifications, and gallery.

## Remaining Deployment/Business Tasks

- [ ] Add production environment variables in Vercel.
- [ ] Connect the final domain and verify DNS/SSL.
- [ ] Submit `https://gopuexports.com/sitemap.xml` to Google Search Console.
- [ ] Add a real email provider API key if enquiry email alerts are required before launch.
- [ ] Replace placeholder/stock product imagery with final approved business photography when available.
- [ ] Confirm all product specs, MOQ, HS codes, certification descriptions, and contact details with the business owner.

## Notes

- Email notification is not enabled because no Resend/SMTP API key or verified sending domain was provided.
- `SUPABASE_SERVICE_ROLE_KEY` is documented but normal dashboard CRUD uses authenticated Supabase sessions plus RLS.
