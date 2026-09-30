-- Restore the public gallery query without exposing internal columns or granting writes.
-- Existing authenticated administrator management policy is retained.
set local lock_timeout = '5s';
set local statement_timeout = '30s';

alter table public.gallery_images enable row level security;

alter policy "Public can read active gallery images"
  on public.gallery_images
  to anon, authenticated
  using (is_active is true);

grant select (id, title, alt_text, image_url, is_active, sort_order, created_at)
  on table public.gallery_images to anon;
