-- Deploy with SUPABASE_SERVICE_ROLE_KEY configured on the server.
begin;
revoke insert on public.inquiries, public.quotes, public.visitor_events from anon;
drop policy if exists "Anyone can create inquiries" on public.inquiries;
drop policy if exists "Public can create validated inquiries only" on public.inquiries;
drop policy if exists "Anyone can create quotes" on public.quotes;
drop policy if exists "Public can create validated quotes only" on public.quotes;
drop policy if exists "Anyone can insert visitor events" on public.visitor_events;
drop policy if exists "Public can insert bounded visitor events" on public.visitor_events;
revoke execute on function public.record_inquiry_email_delivery(uuid, text, boolean, timestamptz, text, boolean, timestamptz, text) from public, anon, authenticated;
revoke execute on function public.record_quote_email_delivery(uuid, text, boolean, timestamptz, text, boolean, timestamptz, text) from public, anon, authenticated;

create table if not exists public.request_limits (
  key text primary key,
  count integer not null,
  expires_at timestamptz not null
);
alter table public.request_limits enable row level security;
revoke all on public.request_limits from public, anon, authenticated;
grant all on public.request_limits to service_role;
create or replace function public.consume_request_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare hits integer;
begin
  if p_limit < 1 or p_window_seconds < 1 then raise exception 'Invalid limit'; end if;
  delete from public.request_limits where expires_at <= now();
  insert into public.request_limits as limits(key, count, expires_at)
  values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key) do update set count = limits.count + 1
  returning count into hits;
  return hits <= p_limit;
end;
$$;
revoke all on function public.consume_request_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_request_limit(text, integer, integer) to service_role;

-- Public readers should not need permission to inspect the administrator table.
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (is_active = true);
drop policy if exists "Public can read active certifications" on public.certifications;
create policy "Public can read active certifications" on public.certifications for select using (is_active = true);
-- Invoker rights preserve the existing administrator-only SELECT policy.
create or replace function public.analytics_summary(p_since timestamptz)
returns jsonb language sql stable security invoker set search_path = '' as $$
with events as (
 select * from public.visitor_events where created_at >= p_since
), dimensions as (
 select dimension, label, count(*) as count from events
 cross join lateral (values ('topPages', path), ('countries', country), ('devices', device), ('browsers', browser), ('eventsByType', event_type)) as d(dimension,label)
 group by dimension,label
), ranked as (
 select *, row_number() over(partition by dimension order by count desc, label) as position from dimensions
), lists as (
 select dimension, jsonb_agg(jsonb_build_object('label', coalesce(nullif(label,''),'Unknown'), 'count', count) order by count desc) as items from ranked where position <= 10 group by dimension
)
select jsonb_build_object(
 'stats', jsonb_build_object(
  'events', count(*), 'uniqueVisitors', count(distinct nullif(session_id,'')),
  'pageViews', count(*) filter(where event_type = 'page_view'),
  'leads', count(*) filter(where event_type in ('inquiry_submit','quote_submit')),
  'avgSessionSeconds', coalesce(round(avg(case when event_type = 'session_duration' and metadata->>'seconds' ~ '^\d{1,7}$' then (metadata->>'seconds')::numeric end)),0),
  'maxScrollDepth', coalesce(max(case when event_type = 'scroll_depth' and metadata->>'depth' ~ '^\d{1,3}$' then least((metadata->>'depth')::integer,100) end),0)
 ),
 'recent', coalesce((select jsonb_agg(to_jsonb(recent)) from (select * from events order by created_at desc limit 30) recent),'[]'::jsonb)
) || coalesce((select jsonb_object_agg(dimension,items) from lists),'{}'::jsonb)
from events;
$$;
revoke all on function public.analytics_summary(timestamptz) from public, anon;
grant execute on function public.analytics_summary(timestamptz) to authenticated;

create or replace function public.mutate_category(p_action text, p_id text, p_body jsonb default '{}'::jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare items jsonb; result jsonb; updated jsonb;
begin
  insert into public.site_settings(key,value) values ('categories','[]'::jsonb) on conflict(key) do nothing;
  select value into items from public.site_settings where key = 'categories' for update;
  if items is null or jsonb_typeof(items) <> 'array' then raise exception 'Categories unavailable'; end if;
  select value into result from jsonb_array_elements(items) where value->>'_id' = p_id;
  if p_action = 'create' then
    if result is not null then raise exception 'Category already exists'; end if;
    result = p_body || jsonb_build_object('_id', p_id);
    updated = items || jsonb_build_array(result);
  elsif p_action = 'update' then
    if result is null then raise exception 'Category not found'; end if;
    result = result || p_body || jsonb_build_object('_id',p_id);
    select coalesce(jsonb_agg(case when value->>'_id' = p_id then result else value end),'[]'::jsonb) into updated from jsonb_array_elements(items);
  elsif p_action = 'delete' then
    if result is null then raise exception 'Category not found'; end if;
    select coalesce(jsonb_agg(value),'[]'::jsonb) into updated from jsonb_array_elements(items) where value->>'_id' is distinct from p_id;
  else raise exception 'Invalid action'; end if;
  update public.site_settings set value = updated where key = 'categories';
  return result;
end;
$$;
revoke all on function public.mutate_category(text,text,jsonb) from public, anon;
grant execute on function public.mutate_category(text,text,jsonb) to authenticated;

drop policy if exists "Public can read active gallery images" on public.gallery_images;
create policy "Public can read active gallery images" on public.gallery_images for select using (is_active = true);
drop policy if exists "Public can read published site settings" on public.site_settings;
create policy "Public can read published site settings" on public.site_settings for select using (key in ('categories','contact','company','social','founder'));
alter table public.inquiries add column if not exists email_payload jsonb;
alter table public.quotes add column if not exists email_payload jsonb;
create table if not exists public.lead_email_jobs (
  lead_table text not null check (lead_table in ('inquiries','quotes')),
  lead_id uuid not null,
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key(lead_table, lead_id)
);
alter table public.lead_email_jobs enable row level security;
revoke all on public.lead_email_jobs from public, anon, authenticated;
grant all on public.lead_email_jobs to service_role;
create or replace function public.enqueue_lead_email() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.lead_email_jobs(lead_table,lead_id,available_at) values (tg_table_name,new.id,now()+interval '2 minutes');
  return new;
end;
$$;
revoke all on function public.enqueue_lead_email() from public, anon, authenticated;
grant execute on function public.enqueue_lead_email() to service_role;
drop trigger if exists enqueue_lead_email on public.inquiries;
create trigger enqueue_lead_email after insert on public.inquiries for each row execute function public.enqueue_lead_email();
drop trigger if exists enqueue_lead_email on public.quotes;
create trigger enqueue_lead_email after insert on public.quotes for each row execute function public.enqueue_lead_email();
create or replace function public.claim_lead_email_jobs() returns setof public.lead_email_jobs language sql security invoker set search_path = '' as $$
  update public.lead_email_jobs j set attempts=attempts+1, available_at=now()+interval '10 minutes'
  where (j.lead_table,j.lead_id) in (
    select lead_table,lead_id from public.lead_email_jobs where completed_at is null and attempts<6 and available_at<=now()
    order by available_at for update skip locked limit 5
  ) returning j.*;
$$;
revoke all on function public.claim_lead_email_jobs() from public, anon, authenticated;
grant execute on function public.claim_lead_email_jobs() to service_role;
commit;
