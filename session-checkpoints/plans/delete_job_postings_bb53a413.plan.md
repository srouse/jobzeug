---
name: Delete job postings
overview: Add a Delete button on each jobs-list row that confirms, then unpublishes and deletes that job posting plus the job lines and job tools it links.
todos:
  - id: delete-tree
    content: "Add deleteJobPostingTree: unpublish and delete the posting, then its linked job lines and job tools, with a shared-reference guard"
    status: completed
  - id: delete-route
    content: Add session-gated DELETE /api/job-posting
    status: completed
  - id: jobs-button
    content: Add Delete + confirm on each jobs-list row, then refresh the list
    status: completed
isProject: false
---

# Delete a job posting and its references

Each published posting on [`src/app/jobs/jobs-list.tsx`](src/app/jobs/jobs-list.tsx) gets a **Delete** button. Confirm with the browser dialog (`Are you sure?` plus the company and title, and that job lines and tools go with it). On confirm, call a session-gated API that removes the Contentful tree.

Job lines and job tools are the only entries a posting references ([`scripts/contentful/lib/schema.mjs`](scripts/contentful/lib/schema.mjs): `lines` and `tools`). Focus briefs are separate hashed entries, not links on the posting, so they stay.

## Cleanup order

Add `deleteJobPostingTree` next to `publishJobPostingTree` in [`src/lib/job-posting/contentful.ts`](src/lib/job-posting/contentful.ts) and export it from [`src/lib/job-posting/index.ts`](src/lib/job-posting/index.ts).

1. Load the entry with the existing CMA client. 404 if it is missing. Reject anything whose content type is not `jobzeugJobPosting`.
2. Read `lines` and `tools` link ids (same `linkIds` helper already in that file).
3. Before deleting anything, query CMA `links_to_entry` for each child. If any entry other than this posting links it, stop and return that error. That keeps a shared line from being removed.
4. Unpublish the posting when it has a published version, unarchive it when archived, then delete it. Deleting the parent drops the links that block child deletion.
5. For each linked child, confirm the content type is `jobzeugJobLine` or `jobzeugJobTool`, then unpublish, unarchive if needed, and delete. A 404 on a child that is already gone is fine.

The plain client already supports this: `entry.unpublish` hits `DELETE .../entries/{id}/published`, and `entry.delete` hits `DELETE .../entries/{id}` with no version header.

## API and list UI

Add `DELETE` on [`src/app/api/job-posting/route.ts`](src/app/api/job-posting/route.ts), using the same session check and `entryId` pattern as `GET`. Body: `{ entryId }`. Success returns the deleted posting id plus line and tool ids.

In [`src/app/jobs/jobs-list.tsx`](src/app/jobs/jobs-list.tsx), put a `JzButton` labeled **Delete** in the row’s link group (`variant="secondary"`, `size="small"`, `showIcon={false}`). After confirm, `DELETE` the posting, drop that row, and `router.refresh()`. While the request runs, disable that row’s button. If it fails, show the error under the row with `JzText` `color="error"`.
