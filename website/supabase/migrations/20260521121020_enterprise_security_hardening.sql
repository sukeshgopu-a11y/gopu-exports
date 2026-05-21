-- GOPU Exports enterprise security hardening.
-- Purpose:
-- - keep public catalogue data readable only when intentionally published
-- - keep lead tables insert-only for public users
-- - keep dashboard/admin data protected by public.admin_users
-- - keep storage buckets publicly readable but admin-write only

alter table public.products enable row level security;
alter table public.inquiries enable row level security;
alter table public.quotes enable row level security;
alter table public.certifications enable row level security;
alter table public.gallery_images enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.visitor_events enable row level security;

alter table public.inquiries
  add column if not exists country_name text,
  add column if not exists country_code text,
  add column if not exists dial_code text,
  add column if not exists local_phone text,
  add column if not exists full_phone_e164 text,
  add column if not exists whatsapp_number_e164 text,
  add column if not exists admin_email_sent boolean not null default false,
  add column if not exists admin_email_sent_at timestamptz,
  add column if not exists admin_email_error text,
  add column if not exists customer_auto_reply_sent boolean not null default false,
  add column if not exists customer_auto_reply_sent_at timestamptz,
  add column if not exists customer_auto_reply_error text,
  add column if not exists delivery_token text default encode(gen_random_bytes(16), 'hex');

alter table public.quotes
  add column if not exists country_name text,
  add column if not exists country_code text,
  add column if not exists dial_code text,
  add column if not exists local_phone text,
  add column if not exists full_phone_e164 text,
  add column if not exists whatsapp_number_e164 text,
  add column if not exists admin_email_sent boolean not null default false,
  add column if not exists admin_email_sent_at timestamptz,
  add column if not exists admin_email_error text,
  add column if not exists customer_auto_reply_sent boolean not null default false,
  add column if not exists customer_auto_reply_sent_at timestamptz,
  add column if not exists customer_auto_reply_error text,
  add column if not exists delivery_token text default encode(gen_random_bytes(16), 'hex');

-- Grants expose only the minimum Data API operations needed by browser and
-- authenticated dashboard clients. RLS policies below remain the row-level
-- authorization boundary.
grant select on public.products, public.certifications, public.gallery_images to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert on public.inquiries, public.quotes, public.visitor_events to anon, authenticated;
grant select, insert, update, delete on
  public.products,
  public.inquiries,
  public.quotes,
  public.certifications,
  public.gallery_images,
  public.site_settings,
  public.visitor_events
to authenticated;
grant select on public.admin_users to authenticated;

create index if not exists products_active_slug_idx on public.products (slug) where is_active = true;
create index if not exists certifications_active_sort_idx on public.certifications (sort_order, created_at desc) where is_active = true;
create index if not exists gallery_images_active_sort_idx on public.gallery_images (sort_order, created_at desc) where is_active = true;
create index if not exists inquiries_email_status_idx on public.inquiries (admin_email_sent, customer_auto_reply_sent, created_at desc);
create index if not exists quotes_email_status_idx on public.quotes (admin_email_sent, customer_auto_reply_sent, created_at desc);
create index if not exists visitor_events_path_created_at_idx on public.visitor_events (path, created_at desc) where path is not null;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read published site settings"
on public.site_settings for select
to anon, authenticated
using (
  key in ('blogs', 'categories', 'contact', 'company', 'social', 'founder')
  or exists (select 1 from public.admin_users where id = (select auth.uid()) and role = 'admin')
);
comment on policy "Public can read published site settings" on public.site_settings
is 'Public reads only non-sensitive CMS keys needed for published pages; admins can read all settings.';

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
comment on policy "Public can create validated inquiries only" on public.inquiries
is 'Public users can insert enquiries only with required buyer fields; public read/update/delete remains blocked.';

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
comment on policy "Public can create validated quotes only" on public.quotes
is 'Public users can insert quote requests only with required buyer fields; public read/update/delete remains blocked.';

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
comment on policy "Public can insert bounded visitor events" on public.visitor_events
is 'Anonymous analytics are insert-only with bounded fields to limit abuse and storage amplification.';

-- Storage buckets are public-read only. Dashboard uploads use authenticated
-- admin sessions or the server service role; public write/update/delete is not
-- granted by any storage.objects policy.
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
