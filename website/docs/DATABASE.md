# Database

This project now uses Supabase PostgreSQL for website data, admin dashboard data, and admin authentication.

The old MongoDB/Mongoose plan is no longer active. Runtime code should use the Supabase clients in `src/lib/supabase/` and API routes under `app/api/`.

## Required Supabase Project Setup

1. Create or open the Supabase project.
2. Open the Supabase SQL Editor.
3. Paste and run the full SQL from `supabase/schema.sql`.
4. Add the environment variables from `.env.local.example` to `.env.local` and to the deployment platform.
5. Create an admin user in Supabase Auth.
6. Insert that user's Auth UUID into `public.admin_users`.

Example admin row:

```sql
insert into public.admin_users (id, email, full_name, role)
values ('AUTH_USER_UUID_HERE', 'admin@example.com', 'Admin User', 'admin');
```

## Tables

### products

Stores website products managed from the dashboard.

Important fields:
- `slug` is unique and is used by product detail pages.
- `is_active` controls public visibility.
- `is_featured` controls homepage featured products.
- `specifications` stores flexible product details as JSON.

### inquiries

Stores general inquiry form submissions.

Public users can insert rows through the site. Only admin users can read, update, or delete rows through protected API routes.

### quotes

Stores quote request form submissions.

Public users can insert rows through the site. Admin users can view and update quote status in the dashboard.

### certifications

Stores certification/logo content displayed on the website.

`is_active` controls whether a certification is visible publicly.

### admin_users

Maps Supabase Auth users to dashboard access.

Dashboard access requires both:
- a valid Supabase Auth session
- a matching row in `public.admin_users`

### site_settings

Stores editable website settings as JSON values.

## Row Level Security

RLS is enabled on all public tables in `supabase/schema.sql`.

Public access is intentionally limited:
- active products are readable publicly
- active certifications are readable publicly
- inquiries can be inserted publicly
- quotes can be inserted publicly
- site settings can be read publicly

Admin access is controlled by checking the signed-in Supabase Auth user's UUID against `public.admin_users`.

The service role key is used only in server-side API routes where admin operations need privileged access. It must never be imported into client components or browser code.

## Application Clients

Supabase client files:
- `src/lib/supabase/client.ts` creates the browser client for client components.
- `src/lib/supabase/server.ts` creates the SSR server client with cookie support.
- `src/lib/supabase/admin.ts` creates the server-only service-role client for maintenance tasks that require it.
- `src/lib/supabase/public.ts` creates a server-side anon client for public reads/writes.
- `src/lib/supabase/data.ts` maps Supabase rows to the existing UI/API shapes.

## Environment Variables

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The anon key is safe to expose in browser code when RLS policies are correct. The service role key bypasses RLS and must only be used on the server. Normal dashboard CRUD uses the signed-in Supabase session plus RLS, so the service role key is not imported by client components.

## Main Data Flows

Public website:
- Homepage featured products load active featured products from `products`.
- Product listing/detail pages load only active products.
- Certifications page loads only active certifications.
- General inquiry forms insert into `inquiries`.
- Quote forms insert into `quotes`.

Admin dashboard:
- Login uses Supabase Auth email/password.
- Dashboard access requires a matching `admin_users` row.
- Products can be added, edited, hidden, shown, or deleted.
- Inquiries and quotes can be viewed and status-updated.
- Certifications can be added, edited, hidden, shown, or deleted.
- Site settings are stored in `site_settings`.

## Verification

After applying SQL and environment variables, run:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Then test:
- `/`
- `/products`
- `/certifications`
- `/contact`
- `/dashboard/login`
- `/dashboard/products`
- `/dashboard/inquiries`
- `/dashboard/quotes`
- `/dashboard/certifications`
- `/dashboard/settings`
