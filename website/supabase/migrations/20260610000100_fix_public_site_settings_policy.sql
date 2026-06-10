-- Keep public CMS keys readable without requiring anon access to admin_users.
drop policy if exists "Public can read published site settings" on public.site_settings;

create policy "Public can read published site settings"
on public.site_settings for select
to anon, authenticated
using (
  key in ('blogs', 'categories', 'contact', 'company', 'social', 'founder')
);

comment on policy "Public can read published site settings" on public.site_settings
is 'Public reads only non-sensitive CMS keys needed for published pages. Authenticated admin access is handled by the separate admin manage policy.';
