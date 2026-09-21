---
name: Site password gate
overview: "Add a site-wide shared-password login for Hobby/Vercel: one login page, httpOnly session cookie, Next middleware that blocks everything else until authenticated—so /chat and /api/chat cannot burn the OpenAI key anonymously."
todos:
  - id: auth-helpers-env
    content: Add site-auth helpers + SITE_PASSWORD/SESSION_SECRET to .env.example and README
    status: completed
  - id: login-logout
    content: Add /login page and /api/login + /api/logout routes
    status: completed
  - id: middleware
    content: Add global middleware protecting all routes except login/static
    status: completed
isProject: false
---

# Site-wide password gate

## Approach

Shared password in env (`SITE_PASSWORD`). User hits any URL → middleware sends them to `/login` → correct password sets an **httpOnly** cookie → full site (including `/api/chat`) works until the cookie expires or they log out.

No Vercel Deployment Protection (Hobby). No per-user accounts—one password for anyone you share it with.

## Implementation

### 1. Env

Update [`.env.example`](.env.example):

- `SITE_PASSWORD=` (required in production; middleware fails closed if missing on Vercel)
- `SESSION_SECRET=` (random string used to sign the cookie; required so changing the password doesn’t need a code change for signing)

Document both in [`README.md`](README.md). Add the same vars in Vercel project env (Production + Preview).

### 2. Auth helpers

Small server-only module e.g. [`src/lib/site-auth.ts`](src/lib/site-auth.ts):

- Cookie name: `jobzeug_session`
- Value: HMAC-SHA256 of a fixed payload with `SESSION_SECRET` (e.g. `authenticated`)
- `createSessionCookie()` / `clearSessionCookie()` / `isValidSessionCookie(value)`
- Cookie flags: `httpOnly`, `secure` in production, `sameSite: lax`, `path: /`, max-age **7 days**

### 3. Login + logout routes

- [`src/app/login/page.tsx`](src/app/login/page.tsx) — minimal password form (POST). Brand “Jobzeug”; no extra chrome.
- [`src/app/api/login/route.ts`](src/app/api/login/route.ts) — compare password to `SITE_PASSWORD` with timing-safe equality; set cookie; redirect to `/` (or `?next=` if present). Wrong password → 401 / back to login with error.
- [`src/app/api/logout/route.ts`](src/app/api/logout/route.ts) — clear cookie; redirect to `/login`.

### 4. Global middleware

[`src/middleware.ts`](src/middleware.ts) (or repo-root `middleware.ts` per Next convention):

- **Allow without cookie:** `/login`, `/api/login`, Next static assets (`_next/static`, `_next/image`, favicon).
- **Everything else** (including `/`, `/chat`, `/api/chat`, `/api/logout` only if already authed): require valid session cookie.
- Unauthenticated page request → redirect to `/login?next=…`
- Unauthenticated API request → `401` JSON (so `/api/chat` isn’t usable without the cookie)

If `SITE_PASSWORD` or `SESSION_SECRET` is unset in production, treat as unauthorized (fail closed). Locally, same fail-closed once those env vars are expected—document that both must be set for `dev` against a locked site.

### 5. Matcher

Protect all routes except static/public assets via `matcher` config so middleware doesn’t run on every image/font unnecessarily.

## Out of scope

- Real user accounts / OAuth
- Per-user chat threads (still the global smoke-test thread)
- Rate limiting beyond the password gate
