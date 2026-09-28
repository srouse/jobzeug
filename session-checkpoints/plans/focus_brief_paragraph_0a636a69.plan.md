---
name: Focus brief paragraph
overview: A Run AI button in the focus stage sends the selected project or job line, its top matches, and the matching evidence files. One agent reads that record and writes a single paragraph under the details already on the card.
todos:
  - id: focus-agent
    content: Add a focus-brief agent with the evidence workspace and register it
    status: completed
  - id: focus-route
    content: Add POST /api/focus-brief that returns one paragraph
    status: completed
  - id: focus-ui
    content: Put Run AI and the paragraph under the focus details
    status: completed
isProject: false
---

# Focus brief

When a project or job line is focused, the stage shows a **Run AI** button under the details and the top-connection list. One click sends that focus cluster and writes one paragraph beneath the button. It does not use the themed chat, so it does not replace the question area or draw new lines.

## What gets sent

The client sends the focus cluster already on the card, including evidence ids:

- **Project focus:** project evidence id, name, and summary, plus each top job line’s theme and text.
- **Job-line focus:** section label and line text, plus each top project’s evidence id, name, and summary.

The route then loads the real project files from `evidence/projects/` (`S026 - ….md` matched by id) and puts that markdown in the prompt. A project focus loads that one file. A job-line focus loads each top project’s file. The resume blurb is only the pointer; the file is the record.

## One call, with the workspace

Still one agent, not the themed outline-and-writers pipeline, and not the chat thread. The agent in [`src/mastra/agents/`](src/mastra/agents/), registered in [`src/mastra/index.ts`](src/mastra/index.ts), uses `openai/gpt-4o` and the same evidence setup as the outline agent: [`evidenceWorkspace`](src/mastra/workspace.ts) plus [`evidenceReadFileTool`](src/mastra/tools/evidence-read-file.ts). No memory, no cite tool.

The route calls `ensureEvidenceWorkspace()` before generate. Instructions: the preloaded project files are the source of truth; open a role or employer file only when the project file is not enough; one paragraph; third person; do not invent; weave the focus to the matches and name the projects so a reader wants to open them.

`POST /api/focus-brief` checks the session the same way [`src/app/api/chat/themed/route.ts`](src/app/api/chat/themed/route.ts) does, validates the cluster, and returns `{ paragraph }`.

## On the card

In [`connection-hub.tsx`](src/components/stage/answer-stage/connection-hub.tsx), under `TopConnections`:

- `JzButton` label “Run AI”, secondary, small.
- While it runs, the button shows that it is working and ignores another click.
- The paragraph renders under the button with `JzText`.
- Changing the focused id clears the paragraph.

Idle stage (nothing focused) has no button.
