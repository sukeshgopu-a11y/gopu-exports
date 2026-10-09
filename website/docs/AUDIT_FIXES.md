# Audit fixes — 9 October 2026

This branch repairs the repository audit. It is not evidence that production is already updated.

## Coordinated deployment

1. Back up the live database and confirm its project ID. The connected Supabase accounts did not expose the website's project during this task.
2. Configure server-only `SUPABASE_SERVICE_ROLE_KEY`, Resend credentials, sender and admin recipient. Public ingestion now fails closed without the service key and rate-limit RPC.
3. Set `TRUSTED_CLIENT_IP_HEADER` only to a header your ingress overwrites. Verify with a real request. An empty setting deliberately shares one conservative bucket across all visitors; do not use that fallback for normal production traffic.
4. Apply `supabase/migrations/20261009081226_server_ingress_and_atomic_limits.sql` to the existing database, then deploy this application in the same maintenance window. The migration revokes anonymous ingestion immediately. For a **fresh** project use the complete `supabase/schema.sql` snapshot instead; do not replay historical migrations over the snapshot.
5. If CAPTCHA is required, configure both Turnstile keys and the canonical hostname in `NEXT_PUBLIC_SITE_URL` or `SITE_URL`. Verify a real successful form submission and a rejected CAPTCHA. Production canonical is `https://gopuexports.com`.
6. Set a random `CRON_SECRET` and schedule an authenticated GET to `/api/admin/retry-emails` every ten minutes. Header: `Authorization: Bearer <CRON_SECRET>`. Alternatively an authenticated administrator can POST to that route with their session. No scheduler or live email was activated during this task. Jobs retry at most six times; inspect exhausted jobs for manual recovery.
7. Verify authenticated dashboard CRUD, public catalogue/CMS, a real enquiry and both email deliveries. Check anonymous direct database writes are denied. Submit `/sitemap.xml` using the existing Search Console property after deployment.

## Implemented

- Disabled public diagnostic email; removed unused legacy auth/test-mail code and key-prefix output.
- Updated Next.js, Sharp and transitive dependencies; production dependency audit clean at verification time. Five development advisories remain in the ESLint/fast-glob/micromatch/braces chain; npm proposes an incompatible framework lint downgrade. No unsafe downgrade applied.
- Shared safe CSV encoding; complete batched lead loading instead of silent 100-row truncation.
- Product partial updates merge specifications with optimistic concurrency checking, and invalidate old/new product pages.
- Atomic category mutations, explicit failure handling in category/settings/quote screens, and upload compensation after failed gallery metadata writes.
- Contact settings feed public navigation/footer/contact and organization metadata. Canonical domain and verified legal identifiers are controlled fields, displayed read-only. Published certification references remain separate from verified legal identifiers. Category filters use managed order/visibility/copy.
- Explicit blog content edits clear superseded structured sections.
- Bounded request streams, strict accepted lead fields, shared database quotas, required CAPTCHA fail-closed behavior, timeout/hostname validation and stable widget callbacks.
- Service-only public ingestion; removed token-RPC fallback; revoked public RPC permissions; simplified public read policies and removed legacy public blog settings.
- Atomic email queue creation, exact persisted retry payloads, stable per-lead delivery keys, provider wait timeout, preserved successful delivery channels and protected recovery handler.
- Analytics aggregates the entire 30-day window in SQL; recent rows are separately bounded. Lead events exclude contact clicks. Session identifiers use session storage and page query strings are not collected.
- PDF images use trusted origins/hosts, disabled redirects, time/byte limits and decoder pixel limits.
- Repeatable database snapshot and explicit fresh-versus-upgrade instructions; tests in CI, including production dependency audit.
- Enforced CSP resource/frame/object/base/form restrictions while retaining inline Next bootstrap compatibility. The stricter script policy stays report-only; this is not a nonce-based XSS guarantee.
- Sitemap fails on blog-query errors instead of publishing an incomplete successful sitemap; controlled canonical URLs and private-route noindex remain intact.

## Validation and limits

`npm run lint`, `npm test`, `npm run build`, production dependency audit, rendered-route SEO crawl and isolated PostgreSQL-compatible tests are the validation gates. Database tests model Supabase roles/auth/storage and load the real snapshot twice. They do not replace a live Supabase verification or advisor run. Runtime SEO checks use local static fallback data because live credentials were unavailable. Search ranking/indexing outcomes are not guaranteed or verified by a local crawl.

The complete lead list is fetched in batches; very large installations should replace that UI with server-side filters and cursor pagination. Offset-based export is not a transactionally frozen snapshot during simultaneous new submissions. Contact details in notification templates remain operational configuration rather than unrestricted CMS-controlled mail destinations.

Verified local crawl: all 74 sitemap URLs returned HTTP 200 with exactly one H1, a title, description and canonical. Six sampled private APIs returned HTTP 401 without credentials. Build generated 102 routes; lint had no warnings. Production npm audit reported zero vulnerabilities. These results used fallback catalogue content, not live CMS data.
