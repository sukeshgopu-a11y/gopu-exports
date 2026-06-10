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
  country_name text,
  country_code text,
  dial_code text,
  local_phone text,
  full_phone_e164 text,
  whatsapp_number_e164 text,
  company text,
  country text,
  message text,
  product_name text,
  quantity text,
  incoterm text,
  admin_notes text,
  product_id uuid references public.products(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'pending', 'read', 'contacted', 'replied', 'closed')),
  admin_email_sent boolean not null default false,
  admin_email_sent_at timestamptz,
  admin_email_error text,
  customer_auto_reply_sent boolean not null default false,
  customer_auto_reply_sent_at timestamptz,
  customer_auto_reply_error text,
  delivery_token text default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now()
);

-- Quote requests for product, quantity, and shipment-specific requests.
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  country_name text,
  country_code text,
  dial_code text,
  local_phone text,
  full_phone_e164 text,
  whatsapp_number_e164 text,
  company text,
  country text,
  product_name text,
  quantity text,
  message text,
  status text not null default 'new' check (status in ('new', 'pending', 'read', 'contacted', 'replied', 'closed')),
  admin_email_sent boolean not null default false,
  admin_email_sent_at timestamptz,
  admin_email_error text,
  customer_auto_reply_sent boolean not null default false,
  customer_auto_reply_sent_at timestamptz,
  customer_auto_reply_error text,
  delivery_token text default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now()
);

alter table public.inquiries
  add column if not exists admin_email_sent boolean not null default false,
  add column if not exists admin_email_sent_at timestamptz,
  add column if not exists admin_email_error text,
  add column if not exists customer_auto_reply_sent boolean not null default false,
  add column if not exists customer_auto_reply_sent_at timestamptz,
  add column if not exists customer_auto_reply_error text,
  add column if not exists delivery_token text default encode(gen_random_bytes(16), 'hex');

alter table public.quotes
  add column if not exists admin_email_sent boolean not null default false,
  add column if not exists admin_email_sent_at timestamptz,
  add column if not exists admin_email_error text,
  add column if not exists customer_auto_reply_sent boolean not null default false,
  add column if not exists customer_auto_reply_sent_at timestamptz,
  add column if not exists customer_auto_reply_error text,
  add column if not exists delivery_token text default encode(gen_random_bytes(16), 'hex');

-- Server route handlers use these token-gated functions when no service role key
-- is configured. The token is generated server-side and is never returned to buyers.
create or replace function public.record_inquiry_email_delivery(
  p_id uuid,
  p_delivery_token text,
  p_admin_email_sent boolean,
  p_admin_email_sent_at timestamptz,
  p_admin_email_error text,
  p_customer_auto_reply_sent boolean,
  p_customer_auto_reply_sent_at timestamptz,
  p_customer_auto_reply_error text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.inquiries
  set
    admin_email_sent = p_admin_email_sent,
    admin_email_sent_at = p_admin_email_sent_at,
    admin_email_error = p_admin_email_error,
    customer_auto_reply_sent = p_customer_auto_reply_sent,
    customer_auto_reply_sent_at = p_customer_auto_reply_sent_at,
    customer_auto_reply_error = p_customer_auto_reply_error
  where id = p_id and delivery_token = p_delivery_token;
end;
$$;

create or replace function public.record_quote_email_delivery(
  p_id uuid,
  p_delivery_token text,
  p_admin_email_sent boolean,
  p_admin_email_sent_at timestamptz,
  p_admin_email_error text,
  p_customer_auto_reply_sent boolean,
  p_customer_auto_reply_sent_at timestamptz,
  p_customer_auto_reply_error text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.quotes
  set
    admin_email_sent = p_admin_email_sent,
    admin_email_sent_at = p_admin_email_sent_at,
    admin_email_error = p_admin_email_error,
    customer_auto_reply_sent = p_customer_auto_reply_sent,
    customer_auto_reply_sent_at = p_customer_auto_reply_sent_at,
    customer_auto_reply_error = p_customer_auto_reply_error
  where id = p_id and delivery_token = p_delivery_token;
end;
$$;

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

-- Row-based blog CMS storage used by dashboard and public blog pages.
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title text not null,
  slug text not null,
  excerpt text not null default '',
  content text not null default '',
  image_url text not null default '',
  author text not null default 'GOPU Exports',
  tags text[] not null default '{}'::text[],
  meta_title text not null default '',
  meta_description text not null default '',
  sections jsonb,
  faqs jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint blog_posts_title_not_empty check (length(trim(title)) > 0),
  constraint blog_posts_slug_not_empty check (length(trim(slug)) > 0)
);

-- Privacy-friendly visitor event log for opt-in analytics in the admin dashboard.
create table if not exists public.visitor_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'page_view',
    'product_view',
    'cta_click',
    'whatsapp_click',
    'email_click',
    'phone_click',
    'inquiry_submit',
    'quote_submit',
    'scroll_depth',
    'session_duration'
  )),
  session_id text,
  path text,
  referrer text,
  country text,
  city text,
  device text,
  browser text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
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

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_featured_idx on public.products (is_active, is_featured);
create index if not exists products_dashboard_order_idx on public.products (sort_order, created_at desc);
create index if not exists products_active_order_idx on public.products (is_active, sort_order, created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_created_at_idx on public.inquiries (status, created_at desc);
create index if not exists inquiries_country_idx on public.inquiries (country) where country is not null;
create index if not exists inquiries_product_name_idx on public.inquiries (product_name) where product_name is not null;
create index if not exists inquiries_full_phone_e164_idx on public.inquiries (full_phone_e164) where full_phone_e164 is not null;
create index if not exists inquiries_delivery_token_idx on public.inquiries (delivery_token) where delivery_token is not null;
create index if not exists quotes_status_idx on public.quotes (status);
create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists quotes_status_created_at_idx on public.quotes (status, created_at desc);
create index if not exists quotes_full_phone_e164_idx on public.quotes (full_phone_e164) where full_phone_e164 is not null;
create index if not exists quotes_delivery_token_idx on public.quotes (delivery_token) where delivery_token is not null;
create index if not exists certifications_active_order_idx on public.certifications (is_active, sort_order);
create index if not exists gallery_images_active_order_idx on public.gallery_images (is_active, sort_order, created_at desc);
create index if not exists site_settings_key_idx on public.site_settings (key);
create unique index if not exists blog_posts_slug_active_idx on public.blog_posts (slug) where deleted_at is null;
create index if not exists blog_posts_public_idx on public.blog_posts (published, published_at desc, created_at desc) where deleted_at is null;
create index if not exists blog_posts_deleted_at_idx on public.blog_posts (deleted_at) where deleted_at is not null;
create index if not exists visitor_events_created_at_idx on public.visitor_events (created_at desc);
create index if not exists visitor_events_type_created_at_idx on public.visitor_events (event_type, created_at desc);
create index if not exists visitor_events_session_idx on public.visitor_events (session_id) where session_id is not null;
create index if not exists visitor_events_path_idx on public.visitor_events (path) where path is not null;

alter table public.products enable row level security;
alter table public.inquiries enable row level security;
alter table public.quotes enable row level security;
alter table public.certifications enable row level security;
alter table public.gallery_images enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.blog_posts enable row level security;
alter table public.visitor_events enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.products, public.certifications, public.gallery_images, public.site_settings to anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert on public.inquiries, public.quotes to anon, authenticated;
grant select, insert, update, delete on public.products, public.inquiries, public.quotes, public.certifications, public.gallery_images, public.site_settings to authenticated;
grant insert, update on public.blog_posts to authenticated;
grant select, insert, update on public.blog_posts to service_role;
revoke delete, truncate, references, trigger on public.blog_posts from anon, authenticated, service_role;
grant select on public.admin_users to authenticated;
grant insert on public.visitor_events to anon, authenticated;
grant select, delete on public.visitor_events to authenticated;
grant execute on function public.record_inquiry_email_delivery(uuid, text, boolean, timestamptz, text, boolean, timestamptz, text) to anon, authenticated;
grant execute on function public.record_quote_email_delivery(uuid, text, boolean, timestamptz, text, boolean, timestamptz, text) to anon, authenticated;

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
create policy "Public can create validated inquiries only"
on public.inquiries for insert
to anon, authenticated
with check (
  length(trim(name)) between 2 and 160
  and length(trim(company)) between 2 and 200
  and length(trim(email)) between 6 and 254
  and position('@' in email) > 1
  and length(trim(coalesce(phone, full_phone_e164, whatsapp_number_e164, ''))) between 8 and 40
  and length(trim(country)) between 2 and 120
  and length(trim(product_name)) between 2 and 200
  and length(trim(quantity)) between 1 and 120
  and coalesce(length(message), 0) <= 12000
);

drop policy if exists "Admins can manage inquiries" on public.inquiries;
create policy "Admins can manage inquiries"
on public.inquiries for all
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Anyone can create quotes" on public.quotes;
create policy "Public can create validated quotes only"
on public.quotes for insert
to anon, authenticated
with check (
  length(trim(name)) between 2 and 160
  and length(trim(company)) between 2 and 200
  and length(trim(email)) between 6 and 254
  and position('@' in email) > 1
  and length(trim(coalesce(phone, full_phone_e164, whatsapp_number_e164, ''))) between 8 and 40
  and length(trim(country)) between 2 and 120
  and length(trim(product_name)) between 2 and 200
  and length(trim(quantity)) between 1 and 120
  and coalesce(length(message), 0) <= 12000
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
create policy "Public can read published site settings"
on public.site_settings for select
using (
  key in ('blogs', 'categories', 'contact', 'company', 'social', 'founder')
);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings for all
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts for select
to anon, authenticated
using (deleted_at is null and published = true);

drop policy if exists "Admins can read blog posts" on public.blog_posts;
create policy "Admins can read blog posts"
on public.blog_posts for select
to authenticated
using (
  deleted_at is null
  and exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);

drop policy if exists "Admins can create blog posts" on public.blog_posts;
create policy "Admins can create blog posts"
on public.blog_posts for insert
to authenticated
with check (
  deleted_at is null
  and exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);

drop policy if exists "Admins can update blog posts" on public.blog_posts;
create policy "Admins can update blog posts"
on public.blog_posts for update
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'))
with check (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Anyone can insert visitor events" on public.visitor_events;
create policy "Public can insert bounded visitor events"
on public.visitor_events for insert
to anon, authenticated
with check (
  event_type in (
    'page_view',
    'product_view',
    'cta_click',
    'whatsapp_click',
    'email_click',
    'phone_click',
    'inquiry_submit',
    'quote_submit',
    'scroll_depth',
    'session_duration'
  )
  and coalesce(length(session_id), 0) <= 128
  and coalesce(length(path), 0) <= 1024
  and coalesce(length(referrer), 0) <= 2048
  and pg_column_size(metadata) <= 8192
);

drop policy if exists "Admins can read visitor events" on public.visitor_events;
create policy "Admins can read visitor events"
on public.visitor_events for select
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

drop policy if exists "Admins can delete visitor events" on public.visitor_events;
create policy "Admins can delete visitor events"
on public.visitor_events for delete
to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin'));

-- Public image buckets used by dashboard uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery', 'gallery', true, 4194304, array['image/jpeg','image/png','image/webp','image/gif']),
  ('products', 'products', true, 4194304, array['image/jpeg','image/png','image/webp','image/gif']),
  ('certifications', 'certifications', true, 4194304, array['image/jpeg','image/png','image/webp','image/gif']),
  ('blogs', 'blogs', true, 4194304, array['image/jpeg','image/png','image/webp','image/gif'])
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
