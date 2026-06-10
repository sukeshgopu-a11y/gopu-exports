-- Blog posts are managed through soft deletes only.
-- Keep Data API permissions limited to reads plus authenticated inserts/updates.

revoke delete, truncate, references, trigger
on public.blog_posts
from anon, authenticated, service_role;

grant select on public.blog_posts to anon, authenticated, service_role;
grant insert, update on public.blog_posts to authenticated, service_role;
