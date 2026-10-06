---
name: Watched video checkmarks
overview: Remember which Resume 2 project videos have been opened, show a check on the right of that project in both list layouts, and add a header button that clears the saved set.
todos:
  - id: watched-store
    content: Add localStorage-backed watched-project context and mount it in ResumePageBody
    status: completed
  - id: mark-on-open
    content: Mark a project watched when its walkthrough video is opened
    status: completed
  - id: row-check
    content: Show a right-side check on watched rows in both MiddleProjects layouts
    status: completed
  - id: clear-button
    content: Add a Clear watched button to the resume header actions slot
    status: completed
isProject: false
---

# Watched-video check marks

Client-only memory of which project videos have been opened. A check appears on the right of that project row in both Resume 2 layouts: the open cards (job posting open) and the employer list (job posting closed).

## When it is recorded

Opening the walkthrough is the Details button in the stage, which calls `onViewProject` and sets `presentationId` in [`src/app/resume-2/workspace.tsx`](src/app/resume-2/workspace.tsx). That is the moment the video mounts in [`connection-hub.tsx`](src/app/resume-2/stage/answer-stage/connection-hub.tsx). Mark the project watched there, using `project.evidenceId` (the same id the rows already use).

Selecting a project, or merely having a video, does not mark it.

## Storage

A small client module, used from a React context mounted in `ResumePageBody`:

- Persist a JSON array of project ids in `localStorage` (key such as `jobzeug:resume-2:watched-projects`). This stays in the browser and is not sent with requests. The clear control wipes that key; it is not an HTTP cookie.
- Start from an empty set and load in `useEffect`, so the server render and the first client render match.
- `markWatched` writes immediately and updates context so the check appears without a reload.
- `clearWatched` removes the key and empties the set.
- Compare ids with the existing `sameProjectId` helper so a `jz-` prefix does not store the same project twice.

## Check on the row

[`MiddleProjects`](src/app/resume-2/middle-projects.tsx) is the only place project names are listed. Both layouts already share one button in `ProjectRow`: the card copy and the browse line. Add one check inside that button, absolutely on the right, so it shows in both states.

- Use `JzIcon` with `icon="Check"` and `size="small"`.
- `aria-label="Watched"`.
- Pad the title so it does not run under the icon.
- Leave the existing blue “has a video” dot as it is. The check is only “opened.”
- Collapsed 6px bars stay clipped by the row’s overflow, so the mark is visible on open cards and on browse rows.

## Test control

[`EvidencePageHeader`](src/components/evidence-page-header/evidence-page-header.tsx) already has an `actions` slot. The resume header in [`workspace.tsx`](src/app/resume-2/workspace.tsx) does not use it yet. Pass a small `JzButton` (`variant="secondary"`, `size="small"`, `showIcon={false}`, label `Clear watched`) that calls `clearWatched`.

## What to look at

`/resume-2` with a job open: open a project’s Details video, then confirm the check on that card. Close the job posting and confirm the same check on the list row. Use Clear watched and confirm both disappear. Refresh before clearing and confirm the check is still there.
