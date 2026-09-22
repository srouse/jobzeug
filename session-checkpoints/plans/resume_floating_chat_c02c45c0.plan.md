---
name: Resume Floating Chat
overview: Add a floating chat dock on `/resume` wired to the existing Mastra chat API, and upgrade the site session cookie so each login gets a unique session ID used as Mastra resource/thread identity.
todos:
  - id: session-sid
    content: Upgrade session cookie to signed {v,sid} UUID; expose getSessionId
    status: completed
  - id: chat-api-session
    content: Scope /api/chat resource+thread by session sid and surface=chat|resume
    status: completed
  - id: resume-dock
    content: Build ResumeChatDock with Clear button; mount on /resume; point /chat at surface=chat
    status: completed
isProject: false
---

# Resume floating chat (session-scoped)

## Problem

[`/api/chat`](src/app/api/chat/route.ts) hardcodes one shared Mastra thread (`jobzeug-local` / `jobzeug-chat`). Auth is a shared password cookie with no per-visitor identity ([`site-auth.ts`](src/lib/site-auth.ts) signs a fixed `"authenticated"` payload). Resume needs a floating chat that is private to the current login session.

## Session identity

Upgrade the session cookie to a signed payload:

```ts
{ v: 1, sid: "<uuid>" }
```

- Generate a new `sid` on each successful login in [`src/app/api/login/route.ts`](src/app/api/login/route.ts)
- Validate HMAC over the canonical JSON payload (same HMAC helper as today)
- Expose `getSessionId(cookieValue)` for API routes
- Existing cookies become invalid → users re-enter the site password once

Mastra IDs derived from `sid`:

| Surface | `resource` | `thread` |
|---------|------------|----------|
| `/chat` | `session:{sid}` | `chat:{sid}` |
| Resume dock | `session:{sid}` | `resume:{sid}` |

Same person (resource), separate conversation threads so resume chat does not collide with the full-page chat.

## Chat API

Update [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts):

- Read session cookie; resolve `sid` (401 if missing/invalid)
- Accept `surface=chat|resume` via query string (GET/DELETE) and JSON body (POST); default `chat`
- Use derived `resource` / `thread` for `handleChatStream`, `recall`, and `deleteThread`
- Fail closed — no fallback to the old global IDs

## Floating dock UI

Add [`src/components/resume-chat-dock.tsx`](src/components/resume-chat-dock.tsx) (client):

- Fixed bottom-right floating button; expands to a compact panel (header + messages + input)
- Same `useChat` + `DefaultChatTransport` pattern as [`src/app/chat/page.tsx`](src/app/chat/page.tsx), pointing at `/api/chat?surface=resume`
- **Clear button** in the expanded panel header (same behavior as `/chat` Restart): `DELETE /api/chat?surface=resume`, then wipe local messages so this session’s resume thread starts fresh
- Light styling to match the resume page (white panel, neutral borders)
- Collapsed by default so it does not block the document

Mount it from [`src/app/resume/page.tsx`](src/app/resume/page.tsx).

## Full-page chat alignment

Update [`src/app/chat/page.tsx`](src/app/chat/page.tsx) to call `/api/chat?surface=chat` so it also becomes session-scoped (no more global shared memory).

## Out of scope

- Real multi-user accounts / passwords per person
- Passing resume JSON into the agent as automatic context (can come later)
- Redesigning `/chat` layout beyond the API surface param
