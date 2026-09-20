---
name: Stories to projects rename
overview: Rename stories→projects and experience→roles (keep S00x and R00x IDs). Mechanical path/label updates only—clarify the maturing evidence data model; no new entity types or content rewrites beyond naming.
todos:
  - id: rename-projects
    content: mv stories→projects; heal paths/labels; add-project skill
    status: completed
  - id: rename-roles
    content: mv experience→roles; heal paths/labels (R00x kept)
    status: completed
  - id: readme-model
    content: Document clear entity table in evidence/README.md
    status: completed
  - id: grep-verify
    content: Grep for leftover stories/ experience/ Story index Experience index add-story
    status: completed
isProject: false
---

# Rename to projects + roles (naming only)

## Intent

Clarify the maturing evidence model with plain folder names:

| Kind | Folder | IDs | Meaning |
|---|---|---|---|
| Employer | `employers/` | **C00x** | Org that employed Scott |
| Role | `roles/` | **R00x** | A job/title tenure at an employer |
| Project | `projects/` | **S00x** | Bounded body of work (metadata + account) |
| Customer | `customers/` | **CU00x** | Product/platform buyer engagement |
| Client | `clients/` | **CL00x** | Service/delivery engagement |
| Perspective | `perspectives/` | **P00x** | Operating principles / viewpoints |

**Projects** replace “stories” as the record type. Capture stays listen-first.  
**Roles** replace “experience” as the folder for R00x employment records.

**Punt:** cross-cutting narratives that span many projects. No new type for that now.

## Locked decisions

### Projects (was stories)

- [`evidence/stories/`](evidence/stories/) → [`evidence/projects/`](evidence/projects/)
- Keep **S001–S008** (and onward). Document: **S = project** (historical prefix). Goal.md **S1–S6** remain skill IDs (separate namespace).
- Skill: [`.cursor/skills/add-story/`](.cursor/skills/add-story/) → [`.cursor/skills/add-project/`](.cursor/skills/add-project/); paths `evidence/projects/`; triggers add-project / add a project.
- Umbrella/children (S004–S007): still **projects** (parent/child). Structure unchanged.

### Roles (was experience)

- [`evidence/experience/`](evidence/experience/) → [`evidence/roles/`](evidence/roles/)
- Keep **R001–R017** (and onward). Document: **R = role**.
- Labels: “Experience index” → **Role index**; “Experience record” → **Role record** where it means R00x; footers and README nav updated.
- Resume connection fields in projects can keep the phrase “experience record” only if changed to **role record** / link to `roles/R00x` — prefer **role record** for consistency.
- No new add-role skill this pass (roles are seeded from resume; projects link to existing R00x).

## What to change (mechanical)

1. `mv evidence/stories evidence/projects`
2. `mv evidence/experience evidence/roles`
3. Path rewrites across `evidence/` and `.cursor/skills/`:
   - `../stories/` / `stories/` → `projects/`
   - `../experience/` / `experience/` → `roles/`
4. Label rewrites:
   - Story index / Figma Role story index → **Project index**
   - Linked stories → **Linked projects**
   - Employer/customer/client `## Stories` → **## Projects**
   - Experience index → **Role index**
   - Linked projects still point at S00x; role files keep “Linked projects”
5. [`evidence/README.md`](evidence/README.md): single clear entity table (above); projects = detailed work records; roles = employment graph; org hubs unchanged. Discovery queue / navigation use project + role wording.
6. [`evidence/Goal.md`](evidence/Goal.md), [`evidence/Question bank.md`](evidence/Question bank.md), perspectives: type language only.
7. Grep verify: no leftover `stories/`, `experience/` paths (except frozen snapshots / unrelated URLs), no `add-story`, no “Story index” / “Experience index” as nav labels.

## What not to change

- Quoted speech / ordinary English (“amazing story”) inside accounts.
- Frozen source snapshots; URLs containing `/stories/` (e.g. Salesforce).
- Nested “stories inside projects” metadata or spanning-story type.
- Renumbering S→P or R→ something else.
- Substantive edits to project/role content beyond path and type labels.

## Order of work

1. Rename both folders.
2. Bulk path + label heal (Python pass preferred for safety).
3. Rewrite README entity model + skill `add-project`.
4. Grep and fix stragglers.
