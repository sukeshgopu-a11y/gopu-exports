# Deployment Guide

## GOPU Exports Website

This project now uses Next.js, Supabase Auth, Supabase PostgreSQL, and Supabase Storage. MongoDB is not part of the production setup.

## Prerequisites

| Requirement | Version / Source |
|---|---|
| Node.js | 20 LTS recommended |
| npm | Bundled with Node |
| Supabase | Linked project `gopu-exports` |
| Vercel | Recommended host |

## Local Setup

```bash
cd "C:\Users\Balak\OneDrive\Desktop\GE New\website"
npm install
npm run dev
```

The local app runs at `http://localhost:3000` unless that port is occupied.

## Environment Variables

Create `.env.local` for local development and set the same variables in Vercel for production:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe browser variables. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be imported into client components or exposed as a `NEXT_PUBLIC_` variable.

## Supabase Database

Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor when provisioning a new project. It creates:

- products
- inquiries
- quotes
- certifications
- gallery_images
- admin_users
- site_settings
- updated_at triggers
- indexes
- RLS policies
- Storage buckets for products, certifications, gallery, and blogs

The current linked Supabase project has already been repaired with this schema.

## Admin User

Create the admin user in Supabase Auth:

- Email: `admin@gopuexports.com`
- Password: managed in Supabase Auth, not in application code

Then map the Auth user into `public.admin_users`:

```sql
insert into public.admin_users (id, email, full_name, role)
select id, email, 'Admin User', 'admin'
from auth.users
where lower(email) = lower('admin@gopuexports.com')
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;
```

## Production Build Check

```bash
npm run lint
npm run build
```

Do not deploy until `npm run build` passes.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set the root directory to the Next.js project folder if the repository root is not already `website`.
4. Add the Supabase environment variables in Vercel Project Settings.
5. Deploy from `main`.
6. Add the production domain in Vercel Domains and configure DNS.

## Post-Deploy Tests

- Public homepage loads.
- Products page loads active Supabase products.
- Product detail pages load by slug.
- Contact quote form saves to Supabase and appears in dashboard.
- Footer inquiry form saves to Supabase and appears in dashboard.
- Admin login works with Supabase Auth.
- Dashboard routes reject unauthenticated users.
- Product add/edit/hide/delete works.
- Certification add/edit/hide/delete works.
- Gallery add/edit/hide/delete works.
- `/sitemap.xml` and `/robots.txt` load.

## Remaining Business Launch Tasks

- Add final Vercel production environment variables.
- Connect final domain, DNS, and SSL.
- Submit `/sitemap.xml` in Google Search Console.
- Add an email provider key if automated enquiry notification emails are required.
- Replace any temporary product imagery with approved business photography.
- Confirm final product specs, MOQ, HS codes, certification wording, and contact details with the business owner.
