---
name: Analytics design alignment
overview: Move the analytics page onto the app shell so it uses the same design-system type, surfaces, and components as the resume, while keeping the three-column layout, scores, and click-to-focus behavior.
todos:
  - id: extract-load
    content: Extract analytics GET data assembly into a server loader and move rescore POST to an API route.
    status: completed
  - id: react-page
    content: Replace the HTML document with an analytics page that renders inside the app layout.
    status: completed
  - id: design-system-view
    content: Rebuild the three columns with JzText, JzButton, JzTag, EvidencePageHeader, and semantic tokens, keeping selection behavior.
    status: completed
isProject: false
---

# Align analytics with the resume

Analytics is a throwaway HTML document in [`src/app/analytics/route.ts`](src/app/analytics/route.ts). It returns its own `<html>` page, so it never goes through [`src/app/layout.tsx`](src/app/layout.tsx) and never loads `@jobzeug/design-system/tokens.css`. Type is `system-ui`, and colors are hardcoded (`#666`, `#d4d4d4`, `#2563eb`).

The resume column is the target: canvas background, surface panels, subtle borders, and `JzText` / `JzButton` / `JzTag` — see [`src/components/resume/resume-document/resume-document.tsx`](src/components/resume/resume-document/resume-document.tsx) and [`src/components/evidence-page-header/evidence-page-header.tsx`](src/components/evidence-page-header/evidence-page-header.tsx).

This pass changes presentation only. Scoring, ranking columns, details toggle, rescore, and click-to-focus stay as they are. The page stays three columns (rankings, projects, job lines). It does not become a reading resume.

## Route split

Next.js cannot serve `route.ts` and `page.tsx` from the same segment, so the document has to become a page.

- Extract the GET data assembly (catalog, scores, ranking rows, line payload) into a server function, e.g. [`src/app/analytics/load.ts`](src/app/analytics/load.ts).
- Add [`src/app/analytics/page.tsx`](src/app/analytics/page.tsx). The root layout then supplies tokens and fonts. Site auth already runs in [`src/proxy.ts`](src/proxy.ts).
- Move the existing POST (`saveJobPostingMatchGraph`) to [`src/app/api/analytics/rescore/route.ts`](src/app/api/analytics/rescore/route.ts), still requiring `jobPostingEntryId`.
- Remove the HTML document from [`src/app/analytics/route.ts`](src/app/analytics/route.ts).

## View

A client view, [`src/app/analytics/analytics-view.tsx`](src/app/analytics/analytics-view.tsx), plus [`src/app/analytics/analytics.module.css`](src/app/analytics/analytics.module.css), replaces the inline `<style>` and the DOM script.

- Page background: `--jz-semantic-color-background-canvas-subtle`. Columns: `--jz-semantic-color-background-surface-default` with `--jz-semantic-color-border-subtle`, matching the resume article and header.
- Column titles use `EvidencePageHeader` and `JzText` (`overline` for the company, `heading` for the job title and pane titles), the same pattern as the resume header.
- Fit percents stay in the aside head, rendered with `JzText` instead of raw divs.
- Concept chips use `JzTag`. Statements and meta use `JzText` body and caption, muted where the old CSS used `#666`.
- Rescore uses `JzButton` (`secondary`, small). The details control stays a checkbox with caption text.
- Ranking tables stay tables. Header type, cell borders, and the selected row use semantic text, border, and brand surface tokens instead of hex colors.
- Selection state (dim, reorder, hit score, deep links `projectId` / `lineEntryId`) moves from the inline script’s `innerHTML` into React state so the hit detail can use `JzText` too.
- Quiet the orange “scoring …” line to muted caption text.

Do not change anything under `packages/design-system`. Consume published exports only.
