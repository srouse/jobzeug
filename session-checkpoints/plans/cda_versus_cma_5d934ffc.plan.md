---
name: CDA versus CMA
overview: Record where Jobzeug calls the Content Delivery API and the Content Management API, which URL each call uses, and which Management reads can move to Delivery.
todos:
  - id: cda-posting-loader
    content: Add a Delivery loader that fetches one published posting plus its lines and tools with include=2.
    status: pending
  - id: resume-get
    content: Point GET /api/job-posting at the Delivery loader.
    status: pending
  - id: analytics-get
    content: Point the Analysis page read at the Delivery loader.
    status: pending
  - id: jobs-list
    content: Load every posting on /jobs through Delivery, batched with sys.id[in] and include=2.
    status: pending
  - id: match-get
    content: Point GET /api/job-posting/match at the Delivery loader.
    status: pending
  - id: save-graph-read
    content: Read the posting with Delivery inside saveJobPostingMatchGraph; leave the update and publish on Management.
    status: pending
  - id: focus-brief-read
    content: Read a published focus brief with Delivery; leave create, update, and publish on Management.
    status: pending
isProject: false
---

# Contentful API usage

Space `rtkhko6y3s3u`, environment `master-2026-09-20`. Delivery is `cdn.contentful.com`. Management is `api.contentful.com`. Preview (`preview.contentful.com`) is never called.

A typical session is one resume open with a posting already in the URL, plus one Analysis open: about **6 Delivery calls and 40 Management calls**. Browsing projects and job lines makes no further Contentful calls. The Contentful links in the header are the web app, not an API.

The plan viewer cannot render markdown tables, so each row is listed with the same columns: location, what it does, API, Contentful URL, calls, how often, and whether it can be done without CMA.

## `/resume` and `/resume/{entryId}` via `GET /api/resume`

- What: loads employers, roles, projects, and presentations. Implemented in [src/lib/contentful/delivery.ts](src/lib/contentful/delivery.ts) `fetchCoreCatalog`.
- API: CDA
- URL: `GET https://cdn.contentful.com/spaces/rtkhko6y3s3u/environments/master-2026-09-20/entries` with `content_type` `jobzeugEmployer`, `jobzeugRole`, `jobzeugProject`, or `jobzeugProjectPresentation`
- Calls: 4 reads
- How often: every resume open. About 4 of ~46 calls (~10%)
- Can this be done without CMA: Yes. It already is. This row never calls Management.

## `/resume/{entryId}` via `GET /api/job-posting?entryId=`

- What: loads that posting, then each linked line and tool, one entry at a time. Implemented in [src/lib/job-posting/contentful.ts](src/lib/job-posting/contentful.ts) `loadJobPostingByEntryId`.
- API: CMA
- URL: `GET https://api.contentful.com/spaces/rtkhko6y3s3u/environments/master-2026-09-20/entries/{id}` for `jz-JP…`, `jz-JP…-line-N`, and `jz-JP…-tool-N`
- Calls: about 20 reads for a 15-line posting with a few tools (1 + lines + tools)
- How often: every open of a saved posting, and again when Analysis opens. About 40 of ~46 calls (~85%)
- Can this be done without CMA: Yes. These entries are published before they are read. One Delivery request, `GET …/entries?sys.id[in]={postingId}&include=2`, returns the posting plus its `lines` and `tools` in `includes.Entry`. The resume UI does not need Management `sys.version`; `toJobPostingPanelData` strips `entryRevisions` before the client sees them.

## `/resume` bind form via `POST /api/job-posting`

- What: reads the matching catalog, writes the posting tree, then reads it back. Write path is `publishJobPostingTree` in [src/lib/job-posting/contentful.ts](src/lib/job-posting/contentful.ts).
- API: CDA, then CMA
- URL: Delivery `/entries` for `jobzeugProject` and `jobzeugMatchingVocabulary`. Management `GET`/`PUT …/entries/{id}` and `PUT …/entries/{id}/published` for each line, tool, and the posting.
- Calls: 2 Delivery reads, then about 80 Management calls
- How often: a few times a week, when a new job URL is bound
- Can this be done without CMA: No for the writes. Create, update, and publish cannot go through Delivery. The matching-catalog read already uses Delivery. The read-back right after publish should stay on Management, because Delivery can lag behind a publish.

## `/analytics?jobPostingEntryId=`

- What: loads the posting tree again, then the matching catalog. [src/app/analytics/route.ts](src/app/analytics/route.ts)
- API: CMA, then CDA
- URL: the same Management entry URLs as the resume load, then Delivery `/entries` for `jobzeugProject` and `jobzeugMatchingVocabulary`
- Calls: about 20 Management reads and 2 Delivery reads
- How often: once in a typical session, from the chart icon
- Can this be done without CMA: Yes. The posting tree is the same published read as `/resume/{entryId}`, so it can be the one Delivery `include=2` request. The matching catalog is already Delivery.

## `POST /analytics?jobPostingEntryId=`

- What: rewrites `matchGraph` on that posting. `saveJobPostingMatchGraph` in [src/lib/job-posting/contentful.ts](src/lib/job-posting/contentful.ts)
- API: CMA
- URL: `GET` and `PUT …/entries/jz-JP…`, then `PUT …/entries/jz-JP…/published`
- Calls: about 20 reads plus 3 writes
- How often: only if that save is used. Opening Analysis does not do this.
- Can this be done without CMA: No for the write. Saving `matchGraph` is an update and a publish. The ~20 reads of the published tree can move to Delivery; the get, update, and publish of `jz-JP…` cannot.

## `/jobs`

- What: lists published postings, loads the matching catalog, then loads every posting tree. [src/app/jobs/load.ts](src/app/jobs/load.ts)
- API: CDA, then CMA
- URL: Delivery `/entries` for `jobzeugJobPosting`, `jobzeugProject`, and `jobzeugMatchingVocabulary`. Then the same Management entry reads as a resume load, once per posting.
- Calls: 3 Delivery reads, plus about 20 Management reads per saved posting
- How often: only when `/jobs` is opened. This is the large Management spike.
- Can this be done without CMA: Yes. The list and the matching catalog are already Delivery. The per-posting Management walk is the same published tree, so one or a few Delivery calls with `sys.id[in]` and `include=2` can replace the ~20 reads repeated for every saved posting.

## Resume focus via `POST /api/focus-brief`

- What: would read or publish a `jobzeugFocusBrief` entry. [src/lib/focus-brief-entry.ts](src/lib/focus-brief-entry.ts)
- API: CMA
- URL: `GET`/`PUT …/entries/{briefId}` and `PUT …/published`
- Calls: 1 read, or get + update + publish
- How often: off. `FOCUS_BRIEF_PAUSED` in [src/components/stage/answer-stage/connection-hub.tsx](src/components/stage/answer-stage/connection-hub.tsx) never sends the request.
- Can this be done without CMA: The read of an already published brief can. Create, update, and publish cannot. Delivery cannot write the paragraph.

## Match button via `GET /api/job-posting/match`

- What: reloads the posting tree and the matching catalog, then logs scores. [src/app/api/job-posting/match/route.ts](src/app/api/job-posting/match/route.ts)
- API: CMA, then CDA
- URL: the same Management entry URLs and the two Delivery catalog queries
- Calls: about 20 Management reads and 2 Delivery reads
- How often: only when that button is pressed
- Can this be done without CMA: Yes. Same published posting tree as the resume load, so one Delivery `include=2` request. Delivery `sys.revision` is enough for the debug payload. The matching catalog is already Delivery.

## `npm run contentful:push`

- What: publishes evidence entries. [scripts/contentful/push.mjs](scripts/contentful/push.mjs)
- API: CMA
- URL: `GET`/`PUT …/entries/jz-S…` (and employers, roles, presentations, vocabulary) and `PUT …/published`
- Calls: about 3 per catalog entry, on the order of 200 for a full push
- How often: when evidence is published, not while using the resume
- Can this be done without CMA: No. Compress publishes entries. Delivery cannot create, update, or publish.

## Preview

- What: none
- API: CPA
- URL: `https://preview.contentful.com/spaces/rtkhko6y3s3u/environments/master-2026-09-20/entries`
- Calls: 0
- How often: never. No preview host is configured.
- Can this be done without CMA: Yes. Nothing here calls Management. Preview is unused.

Moving the published reads (resume posting load, Analysis open, `/jobs`, and the Match button) would take a typical session from about 40 Management calls down to 0, and leave about 6 Delivery calls. Writes stay on Management: bind, the read-back right after that publish, saving `matchGraph`, focus-brief writes, and `contentful:push`.

# Game plan

Add one Delivery loader and point the published reads at it. Leave every write, and the read immediately after a bind, on Management.

`loadJobPostingByEntryId` in [src/lib/job-posting/contentful.ts](src/lib/job-posting/contentful.ts) walks the tree with one Management `entry.get` per posting, line, and tool. Delivery already resolves the locale, so the new loader uses `getDeliveryClient()` from [src/lib/contentful/delivery.ts](src/lib/contentful/delivery.ts): `getEntries({ 'sys.id[in]': [postingId], include: 2 })`. Map `includes.Entry` into the same `JobPostingView`. Use Delivery `sys.revision` where the Match payload wants a revision.

Stay on `loadJobPostingByEntryId` for the read-back in `POST` [src/app/api/job-posting/route.ts](src/app/api/job-posting/route.ts) (the call after `publishJobPostingTree`). Delivery can lag behind that publish.

## Todos

- Add a Delivery loader that fetches one published posting plus its lines and tools with `include=2`.
- Point `GET /api/job-posting` ([src/app/api/job-posting/route.ts](src/app/api/job-posting/route.ts)) at that loader.
- Point the Analysis page read ([src/app/analytics/route.ts](src/app/analytics/route.ts) `GET`) at that loader.
- Load every posting on `/jobs` ([src/app/jobs/load.ts](src/app/jobs/load.ts)) through Delivery, batched with `sys.id[in]` and `include=2`, instead of one Management walk per posting.
- Point `GET /api/job-posting/match` ([src/app/api/job-posting/match/route.ts](src/app/api/job-posting/match/route.ts)) at that loader.
- Inside `saveJobPostingMatchGraph`, read the posting with Delivery. Leave the `matchGraph` update and publish on Management.
- Read a published focus brief with Delivery in `readFocusBrief` ([src/lib/focus-brief-entry.ts](src/lib/focus-brief-entry.ts)). Leave `replaceFocusBrief` and `createFocusBrief` on Management. This route is paused, so it does not change a live session until the pause comes off.
