# TECH STACK
## GOPU Exports — Full Technology Reference

---

### Framework & Runtime

| Technology | Version | Why Used |
|---|---|---|
| **Next.js** | 16.2.6 | Full-stack React framework. Handles routing, SSR, ISR, API routes, and middleware in one project. Note: v16 has breaking changes vs standard Next.js — uses `proxy.ts` instead of `middleware.ts`. |
| **React** | 19.2.4 | UI rendering library. Used for all components. |
| **TypeScript** | ^5 | Type safety across the entire codebase. Catches bugs at compile time. |
| **Node.js** | (runtime) | Server-side JavaScript runtime for API routes and server components. |

---

### Styling

| Technology | Version | Why Used |
|---|---|---|
| **Tailwind CSS** | ^4 | Utility-first CSS. All styling is done via Tailwind classes directly in JSX — no separate stylesheet files. v4 has breaking changes (PostCSS plugin `@tailwindcss/postcss` instead of `tailwindcss` in PostCSS config). |
| **@tailwindcss/postcss** | ^4 | PostCSS integration for Tailwind v4. |

> **Note:** No CSS modules, styled-components, or external UI component libraries (MUI, shadcn, etc.) are used. All UI is hand-built with Tailwind.

---

### Icons

| Technology | Version | Why Used |
|---|---|---|
| **Lucide React** | ^0.468.0 | Open-source SVG icon library. Used throughout admin panel and public pages for all icons. |

---

### Database

| Technology | Version | Why Used |
|---|---|---|
| **MongoDB** | (cloud via Atlas) | NoSQL document database. Chosen for flexibility with product schema variations (different specs per product type). |
| **Mongoose** | ^9.6.2 | MongoDB ODM for Node.js. Provides schema definitions, model validation, and query interface. |

> **Current status**: MongoDB is NOT running locally. The app is configured to use `mongodb://127.0.0.1:27017/gopu-exports` as fallback, but MongoDB Community Server is not installed. **Must migrate to MongoDB Atlas** (cloud) for the app to function.

---

### File Storage

| Technology | Version | Why Used |
|---|---|---|
| **Supabase Storage** | @supabase/supabase-js ^2.105.4 | Cloud file storage for product images and gallery. Chosen because the project originally used Supabase (DB credentials exist in .env). Used for image uploads via `/api/upload` route. |

> **Note:** Supabase is used ONLY for file storage — the database layer uses MongoDB/Mongoose, not Supabase's PostgreSQL.

---

### Authentication

| Technology | Why Used |
|---|---|
| **Custom HMAC-SHA256 tokens** | Stateless session tokens using the Web Crypto API (`crypto.subtle`). No third-party auth library (no NextAuth, no Clerk). Token is stored in an httpOnly cookie with 7-day expiry. Works in Edge runtime. |
| **httpOnly Cookies** | Secure, XSS-resistant session storage. Cannot be accessed via JavaScript. |

---

### Routing / Middleware

| Technology | Why Used |
|---|---|
| **`proxy.ts`** | Next.js 16.2.6 replaces `middleware.ts` with `proxy.ts` using a `proxy()` function export (breaking change). Handles dashboard route protection — redirects unauthenticated users to `/dashboard/login`. |

---

### Package Manager

| Tool | Why Used |
|---|---|
| **npm** | Standard Node.js package manager. `package-lock.json` is present. |

---

### Environment Configuration

Variables used (from `.env.local`):

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string. Currently points to `localhost:27017` — must be updated to MongoDB Atlas. |
| `ADMIN_EMAIL` | Admin login email. Currently `admin@gopuexports.com`. |
| `ADMIN_PASSWORD` | Admin login password. Currently `admin123` — **must be changed before deployment**. |
| `SESSION_SECRET` | HMAC signing key for session tokens. Currently a placeholder — **must be changed before deployment**. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for file storage. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (safe to expose to browser). |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key for server-side uploads. Currently set to placeholder — must get real key from Supabase dashboard. |

---

### What Is NOT Used (Common Alternatives Considered)

| Not Used | Alternative Available |
|---|---|
| NextAuth / Auth.js | Custom HMAC auth instead |
| Prisma | Mongoose instead |
| Supabase DB / PostgreSQL | MongoDB instead |
| shadcn/ui | Hand-built Tailwind components |
| Framer Motion | Plain CSS transitions |
| React Hook Form | Native form handling |
| Zod validation | No schema validation library |
| React Query / SWR | Plain `useEffect` + `fetch` |
| Redux / Zustand | No global state management needed |
| Stripe / payments | No e-commerce required |
| Resend / Nodemailer | Email not yet implemented |

---

### Hosting (Not Yet Configured)

The project has no deployment configuration. Recommended options:

| Platform | Recommendation |
|---|---|
| **Vercel** | Best fit for Next.js. Zero config. Auto-deploys from GitHub. |
| **Railway / Render** | Alternative if custom server needed. |
| **MongoDB Atlas** | Required for database (local MongoDB not viable in production). |
| **Supabase** | Already configured for file storage. |
# Supabase Migration Note

Supabase is now the primary database/auth platform. MongoDB and Mongoose are no longer runtime dependencies.
