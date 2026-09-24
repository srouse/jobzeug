---
name: Persist site password session
overview: The 7-day `jobzeug_session` cookie is fine; production Next.js Link prefetch GETs `/api/logout` from the home page and clears it. Make logout POST-only and replace the prefetchable Log out Link with a form.
todos:
  - id: logout-post-only
    content: Remove GET from /api/logout (POST-only clear + redirect)
    status: completed
  - id: home-logout-form
    content: Replace home Log out Link with POST form styled as secondary action
    status: completed
  - id: verify-session
    content: "Sanity: login, stay on home without logout click, navigate resume/chat still authed"
    status: completed
isProject: false
---

# Fix site password session persistence

## Root cause

The session cookie is already durable (`path: "/"`, `maxAge` 7 days, `httpOnly`, `sameSite: lax`) in [`src/lib/site-auth.ts`](src/lib/site-auth.ts). Proxy gating in [`src/proxy.ts`](src/proxy.ts) treats `/`, `/resume`, `/chat`, and APIs the same.

What kills the session: home puts Log out behind a **Next `Link` to `/api/logout`**, and logout accepts **GET**:

```31:33:src/app/page.tsx
          <Link href="/api/logout" className={styles.secondary}>
            <JzText variant="label" color="inverse" label="Log out" />
          </Link>
```

```17:19:src/app/api/logout/route.ts
export async function GET(req: NextRequest) {
  return POST(req);
}
```

After login, default `next` is `/`. In production, Link viewport/hover **prefetch** issues a GET to `/api/logout`, which clears `jobzeug_session` (`maxAge: 0`). The next navigation looks like “I have to log in every time.”

```mermaid
sequenceDiagram
  participant User
  participant Home
  participant Prefetch
  participant Logout as api_logout
  participant Cookie as jobzeug_session

  User->>Home: land on / after login
  Prefetch->>Logout: GET prefetch
  Logout->>Cookie: clear maxAge 0
  User->>Home: click Resume or Chat
  Note over User,Cookie: proxy sees no valid session
  User->>User: redirected to login
```

## Fix (concrete)

1. **Logout API — POST only**  
   In [`src/app/api/logout/route.ts`](src/app/api/logout/route.ts): remove `GET`. Keep POST that redirects to `/login` and clears the cookie with the same attributes as set (incl. `path: "/"`).

2. **Home — POST logout, no Link**  
   In [`src/app/page.tsx`](src/app/page.tsx): replace `<Link href="/api/logout">` with a `<form method="POST" action="/api/logout">` and a submit control styled like the existing secondary action (button or styled submit). Resume/Chat stay as `Link`s.

3. **Sanity**  
   Log in → land on `/` → wait / hover Log out without clicking → navigate to `/resume` and `/chat` — stay authenticated. Explicit Log out still clears and returns to login.

No change to cookie maxAge, proxy matcher, or password env vars. This is not a “persist better” rewrite; stop accidentally clearing a cookie that already persists.