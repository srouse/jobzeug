---
name: Edit project title
overview: When the presentation editor opens, it takes over the whole project detail, including the header, and saves the title on the project entry while the rest of the form still saves the presentation.
todos:
  - id: editor-takeover
    content: Hide the hub header and the rest of the detail while the editor is open, and add a title input to the form.
    status: completed
  - id: save-project-name
    content: Accept name on the presentation PUT and publish it on the project entry before the presentation fields.
    status: completed
isProject: false
---

# Edit the project title from the detail editor

The detail header is the project `name` on `jobzeugProject` (`jz-S00x`). Blurb, metrics, and video stay on `jobzeugProjectPresentation`. One Save writes both. Cancel or a finished Save returns to the read presentation.

## What opens

In [connection-hub.tsx](src/app/resume-2/stage/answer-stage/connection-hub.tsx), a project focus currently always renders `HubHeader` (title, employer, year, analysis, Contentful link, close) and then the presentation. While editing, that header and the rest of the panel (article link, Details, focus brief) stay hidden. The editor is the whole panel. Employer and date are not fields.

[presentation-editor.tsx](src/app/resume-2/stage/answer-stage/presentation-editor.tsx) reports open and closed. Closed is unchanged: click the blurb and metrics to edit. Open puts a single-line title input at the top of the existing form, filled from `project.name`. Cancel and a successful Save call the close callback so the header and presentation come back. A failed save stays in the form.

## Where it saves

[presentation-write.ts](src/lib/contentful/presentation-write.ts) already loads `jz-{projectId}` to find the presentation link. On a text save, update that project’s localized `name` (Contentful Symbol, required, 256 characters, reject blank) and publish it, then update and publish the presentation as it does now. The route accepts `name` on the same JSON body. Video upload does not touch the title.

A later evidence push still writes `name` from the project markdown. This change does not alter that.