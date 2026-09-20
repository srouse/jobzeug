---
name: Session checkpoint skill
overview: "Adapt the imported session-checkpoint skill for Jobzeug: drop SpecKit and flashcard leftovers, add a versioned `session-checkpoints/` folder that caches relevant Cursor plans and holds the running session log, then commit and push."
todos:
  - id: rewrite-skill
    content: "Rewrite session-checkpoint SKILL.md: drop SpecKit; add plan cache + session-checkpoints log; Jobzeug commit scopes"
    status: completed
  - id: seed-folder
    content: Add session-checkpoints/README.md and empty plans/ + session-log.md scaffold (or let first run create log)
    status: completed
  - id: verify-skill
    content: Sanity-check skill has no SpecKit/deck leftovers and documents plan-match + JSON output
    status: completed
isProject: false
---

# Adapt session-checkpoint for Jobzeug

## What’s irrelevant in the current skill

[`/.cursor/skills/session-checkpoint/SKILL.md`](.cursor/skills/session-checkpoint/SKILL.md) was written for another app. Drop or replace:

| Current content | Verdict |
|---|---|
| SpecKit `/spec/*.md` drift + updates (steps 1–2, Spec Impact in log, `spec_*` JSON) | **Remove entirely** — no `/spec` here; skip-if-missing still leaves SpecKit framing |
| Commit scopes `decks`, SpecKit FR refs, flashcard examples | **Replace** with Jobzeug scopes |
| `git add -A` without naming what matters | **Keep push/commit**, but stage intentionally (never `.env`; rely on [`.gitignore`](.gitignore)) |

Keep: no-questions execution, commit + push, running session log, dedupe latest entry, compact JSON result (retarget fields).

## Target layout

```text
session-checkpoints/
  README.md                 # one short paragraph: what this folder is
  session-log.md            # running log (create on first run)
  plans/                    # cached copies of Cursor plans used for this repo
    *.plan.md
```

Interpretation of “cash in session checkpoints”: **cache** plans into `session-checkpoints/` (repo-root, versioned with the rest of the evidence work). Session log lives here too so checkpoint artifacts stay together (not under `.cursor/rules/`).

## Plan cache rules

Source: `~/.cursor/plans/*.plan.md` (outside the repo).

On each checkpoint:

1. Select plans whose file contents match (case-insensitive) any of: `jobzeug`, `evidence/`, `Workspace/Jobzeug`, `add-project`, `add-story`.
2. Copy selected files into `session-checkpoints/plans/` (overwrite same basename; do not delete plans that no longer match — keep history).
3. Do **not** invent or edit plan bodies; copy only. Do **not** edit the originals under `~/.cursor/plans/`.

Known matches today include at least: `add_story_skill_*.plan.md`, `customers_evidence_log_*.plan.md`, `stories_to_projects_rename_*.plan.md`, and likely Contentful/evidence stubs that mention those paths. Unrelated deck/portfolio plans stay out.

## Rewrite the skill

Replace SpecKit steps with this ordered workflow:

1. **Cache plans** → `session-checkpoints/plans/` (rules above); ensure folder + README exist.
2. **Session log** → append (or update latest if same session) to [`session-checkpoints/session-log.md`](session-checkpoints/session-log.md). Drop Spec Impact; use:

```markdown
### [{{timestamp}}]

#### Summary
- …

#### Changes
- Evidence / records:
- Skills / tooling:
- Other:

#### Decisions
- …

#### Plans cached
- list of basenames copied this run (or “none”)

#### Next
- …
```

3. **Git commit + push** when there is anything to commit among: `evidence/`, `.cursor/skills/`, `session-checkpoints/`, `.gitignore`, and other intentional project files. Never stage `.env`. Message style: `type(scope): summary` with scopes like `evidence`, `skills`, `session`. Push to `origin` (remote already `srouse/jobzeug`).
4. **Output** only JSON (no prose):

```json
{
  "plans_cached": true,
  "committed": true,
  "pushed": true,
  "session_logged": true
}
```

Booleans reflect what actually happened (`plans_cached` true if ≥1 file copied/updated this run).

Also update the skill frontmatter `description` so it no longer mentions SpecKit.

## Out of scope

- Running a checkpoint now (skill rewrite only unless you ask to invoke it after).
- Creating an `add-role` skill or further evidence renames.
- Editing the attached rename plan file under `~/.cursor/plans/`.
