create extension if not exists pgcrypto;

-- Keeps updated_at accurate on content tables.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Product catalogue shown on the public website and managed in the dashboard.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  description text,
  image_url text,
  specifications jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- General website enquiries, including footer quick enquiries.
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  country text,
  message text,
  product_id uuid references public.products(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'pending', 'read', 'contacted', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

-- Quote requests for product, quantity, and shipment-specific requests.
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  country text,
  product_name text,
  quantity text,
  message text,
  status text not null default 'new' check (status in ('new', 'pending', 'read', 'contacted', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

-- Certifications and compliance logos shown on the public website.
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text,
  logo_url text,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.certifications add column if not exists issuer text;

-- Public gallery images shown on the gallery page and managed in the dashboard.
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  alt_text text,
  image_url text not null,
  storage_path text,
  bucket text not null default 'gallery',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Dashboard access allow-list. The id must match auth.users.id.
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Key/value CMS settings for contact details and existing editable content.
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_certifications_updated_at on public.certifications;
create trigger set_certifications_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_images_updated_at on public.gallery_images;
create trigger set_gallery_images_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_featured_idx on public.products (is_active, is_featured);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists quotes_status_idx on public.quotes (status);
create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists certifications_active_order_idx on public.certifications (is_active, sort_order);
create index if not exists gallery_images_active_order_idx on public.gallery_images (is_active, sort_order, created_at desc);
create index if not exists site_settings_key_idx on public.site_settings (key);

alter table public.products enable row level security;
alter table public.inquiries enable row level security;
alter table public.quotes enable row level security;
alter table public.certifications enable row level security;
alter table public.gallery_images enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.products, public.certifications, public.gallery_images, public.site_settings to anon, authenticated;
grant insert on public.inquiries, public.quotes to anon, authenticated;
grant select, insert, update, delete on public.products, public.inquiries, public.quotes, public.certifications, public.gallery_images, public.site_settings to authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
using (
  is_active = true
  or exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Anyone can create inquiries" on public.inquiries;
create policy "Anyone can create inquiries"
on public.inquiries for insert
to anon, authenticated
with check (
  length(trim(name)) > 0
  and length(trim(email)) > 3
  and position('@' in email) > 1
);

drop policy if exists "Admins can manage inquiries" on public.inquiries;
create policy "Admins can manage inquiries"
on public.inquiries for all
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Anyone can create quotes" on public.quotes;
create policy "Anyone can create quotes"
on public.quotes for insert
to anon, authenticated
with check (
  length(trim(name)) > 0
  and length(trim(email)) > 3
  and position('@' in email) > 1
);

drop policy if exists "Admins can manage quotes" on public.quotes;
create policy "Admins can manage quotes"
on public.quotes for all
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Public can read active certifications" on public.certifications;
create policy "Public can read active certifications"
on public.certifications for select
using (
  is_active = true
  or exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);

drop policy if exists "Admins can manage certifications" on public.certifications;
create policy "Admins can manage certifications"
on public.certifications for all
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Public can read active gallery images" on public.gallery_images;
create policy "Public can read active gallery images"
on public.gallery_images for select
using (
  is_active = true
  or exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);

drop policy if exists "Admins can manage gallery images" on public.gallery_images;
create policy "Admins can manage gallery images"
on public.gallery_images for all
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Admins can read own admin record" on public.admin_users;
create policy "Admins can read own admin record"
on public.admin_users for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
using (true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings for all
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

-- Public image buckets used by dashboard uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery', 'gallery', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif']),
  ('products', 'products', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif']),
  ('certifications', 'certifications', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif']),
  ('blogs', 'blogs', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read public image buckets" on storage.objects;
create policy "Public can read public image buckets"
on storage.objects for select
using (bucket_id in ('gallery','products','certifications','blogs'));

drop policy if exists "Admins can insert public image buckets" on storage.objects;
create policy "Admins can insert public image buckets"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('gallery','products','certifications','blogs')
  and exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);

drop policy if exists "Admins can update public image buckets" on storage.objects;
create policy "Admins can update public image buckets"
on storage.objects for update
to authenticated
using (
  bucket_id in ('gallery','products','certifications','blogs')
  and exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
)
with check (
  bucket_id in ('gallery','products','certifications','blogs')
  and exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);

drop policy if exists "Admins can delete public image buckets" on storage.objects;
create policy "Admins can delete public image buckets"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('gallery','products','certifications','blogs')
  and exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);

-- Run this after creating the user in Supabase Auth.
insert into public.admin_users (id, email, full_name, role)
select id, email, 'Admin User', 'admin'
from auth.users
where lower(email) = lower('admin@gopuexports.com')
on conflict (id) do update set email = excluded.email, full_name = excluded.full_name, role = excluded.role;
