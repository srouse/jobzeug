---
name: Jobs list and analytics
overview: Add a simple list of published job postings, each with a resume link and an analytics link, and rename the match-concepts debug page to analytics.
todos:
  - id: rename-analytics
    content: Move /debug/match-concepts to /analytics and redirect the old URL with its query.
    status: completed
  - id: update-links
    content: Point the chart buttons and the README at /analytics.
    status: completed
  - id: jobs-page
    content: Add /jobs listing published postings with resume and analytics links, and link it from home.
    status: completed
isProject: false
---

# Job list and analytics

A short page lists the published job postings. Each row has two links: the resume for that posting, and the match view, renamed from debug to analytics. The site password gate stays as it is.

## Analytics

Move [`src/app/debug/match-concepts/route.ts`](src/app/debug/match-concepts/route.ts) to [`src/app/analytics/route.ts`](src/app/analytics/route.ts). The query stays the same: `jobPostingEntryId`, plus optional `projectId` or `lineEntryId` so a focused project or job line still opens already selected.

Leave a redirect at the old path so existing chart links and bookmarks land on `/analytics` with the same query.

Update the two chart URLs in [`src/components/stage/answer-stage/connection-hub.tsx`](src/components/stage/answer-stage/connection-hub.tsx) to `/analytics?...`. Note the new route in [`README.md`](README.md).

## Job list

New page at `/jobs`. Load published `jobzeugJobPosting` entries through the existing Contentful delivery client in [`src/lib/contentful/delivery.ts`](src/lib/contentful/delivery.ts): entry id, company, and title, newest first. Do not load lines or the match graph.

Each row shows company and title, then:

- Resume: `/resume/{entryId}`
- Analytics: `/analytics?jobPostingEntryId={entryId}`

A plain list using `JzText` and links, in the same spirit as [`src/app/home-client.tsx`](src/app/home-client.tsx). Add a home link to `/jobs`.
