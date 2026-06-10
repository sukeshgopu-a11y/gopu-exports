-- Durable blog CMS table.
-- Keeps the legacy site_settings.blogs JSON untouched while migrating its
-- current values into row-based storage.

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

create unique index if not exists blog_posts_slug_active_idx
on public.blog_posts (slug)
where deleted_at is null;

create index if not exists blog_posts_public_idx
on public.blog_posts (published, published_at desc, created_at desc)
where deleted_at is null;

create index if not exists blog_posts_deleted_at_idx
on public.blog_posts (deleted_at)
where deleted_at is not null;

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

grant select on public.blog_posts to anon, authenticated;
grant insert, update on public.blog_posts to authenticated;
grant select, insert, update on public.blog_posts to service_role;
revoke delete, truncate, references, trigger on public.blog_posts from anon, authenticated, service_role;

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

with legacy_blogs as (
  select elem, ordinality
  from public.site_settings s
  cross join lateral jsonb_array_elements(s.value) with ordinality as items(elem, ordinality)
  where s.key = 'blogs'
    and jsonb_typeof(s.value) = 'array'
),
normalized as (
  select
    nullif(trim(elem->>'_id'), '') as legacy_id,
    coalesce(nullif(trim(elem->>'title'), ''), 'Untitled Blog Post') as title,
    coalesce(nullif(trim(elem->>'slug'), ''), 'legacy-blog-' || ordinality::text) as slug,
    coalesce(elem->>'excerpt', '') as excerpt,
    coalesce(elem->>'content', '') as content,
    coalesce(elem->>'image', '') as image_url,
    coalesce(nullif(trim(elem->>'author'), ''), 'GOPU Exports') as author,
    case
      when jsonb_typeof(elem->'tags') = 'array'
        then array(select jsonb_array_elements_text(elem->'tags'))
      else '{}'::text[]
    end as tags,
    coalesce(elem->>'metaTitle', elem->>'title', 'Untitled Blog Post') as meta_title,
    coalesce(elem->>'metaDescription', elem->>'excerpt', '') as meta_description,
    case when jsonb_typeof(elem->'sections') = 'array' then elem->'sections' else null end as sections,
    case when jsonb_typeof(elem->'faqs') = 'array' then elem->'faqs' else null end as faqs,
    lower(coalesce(elem->>'published', 'false')) in ('true', '1', 'yes') as published,
    case
      when coalesce(elem->>'createdAt', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        then (elem->>'createdAt')::timestamptz
      else now()
    end as created_at,
    case
      when coalesce(elem->>'updatedAt', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        then (elem->>'updatedAt')::timestamptz
      when coalesce(elem->>'createdAt', '') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        then (elem->>'createdAt')::timestamptz
      else now()
    end as updated_at
  from legacy_blogs
)
insert into public.blog_posts (
  legacy_id,
  title,
  slug,
  excerpt,
  content,
  image_url,
  author,
  tags,
  meta_title,
  meta_description,
  sections,
  faqs,
  published,
  published_at,
  created_at,
  updated_at
)
select
  n.legacy_id,
  n.title,
  n.slug,
  n.excerpt,
  n.content,
  n.image_url,
  n.author,
  n.tags,
  n.meta_title,
  n.meta_description,
  n.sections,
  n.faqs,
  n.published,
  case when n.published then n.updated_at else null end,
  n.created_at,
  n.updated_at
from normalized n
where not exists (
  select 1
  from public.blog_posts existing
  where (n.legacy_id is not null and existing.legacy_id = n.legacy_id)
     or (existing.deleted_at is null and existing.slug = n.slug)
);
