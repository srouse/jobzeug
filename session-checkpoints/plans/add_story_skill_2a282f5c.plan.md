---
name: Add story skill
overview: Done. Project skill add-story loads the evidence/ workspace and captures stories (S00x) linked to existing company and experience records. Folder renamed from ideas/ to evidence/.
todos:
  - id: create-skill
    content: Create .cursor/skills/add-story/SKILL.md
    status: completed
  - id: rename-evidence
    content: Rename ideas/ to evidence/ and update skill paths
    status: completed
isProject: false
---

# Add-story skill for the evidence workspace — DONE

Implemented. Skill lives at [`.cursor/skills/add-story/SKILL.md`](.cursor/skills/add-story/SKILL.md). Workspace folder is [`evidence/`](evidence/) (renamed from `ideas/`).

The skill is **explicitly invoked** (`disable-model-invocation: true`).

## What it does

On invoke, the agent reads:

1. `evidence/README.md`
2. `evidence/stories/INDEX.md`
3. `evidence/companies/INDEX.md`
4. `evidence/experience/INDEX.md`
5. `evidence/stories/S001 - Blueprints.md`

Then ready-state → listen → resolve C/R → write story → update indexes → 2–4 follow-ups.

## Status

- Skill file: complete
- `ideas/` → `evidence/`: complete
- Paths in skill: point at `evidence/`
