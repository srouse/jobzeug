---
name: session-checkpoint
description: >-
  End-of-session workflow: cache relevant Cursor plans into session-checkpoints/plans/,
  append session-checkpoints/session-log.md, then git add/commit/push. On invocation,
  run steps without questions, without narrating steps, and return only the JSON result.
  Use for end-of-session check-in, session log updates, and commit + push.
---

# Session checkpoint

## When this skill runs

Invoke via **@session-checkpoint** or the **/session-checkpoint** command (or equivalent project skill entry). Same workflow applies for an informal “check-in” request when the user clearly wants this skill.

## Execution

- Do **not** ask questions.
- Do **not** explain or narrate steps.
- Execute all steps below **in order**.
- **Return only** the final JSON object in the Output section (no other prose).

---

## Goal

Run end-of-session workflow:

1. Cache relevant Cursor plans into `session-checkpoints/plans/`
2. Append or roll the session log (`session-checkpoints/session-log.md`)
3. Commit and push when applicable

---

## Steps

### 1. Ensure checkpoint folder

Ensure these exist (create if missing):

```text
session-checkpoints/
  README.md
  session-log.md
  plans/
```

If `README.md` is missing, write a short paragraph: this folder caches Cursor plans used for Jobzeug and holds the running session log; do not edit plan copies by hand unless correcting a bad cache.

### 2. Cache plans

Source: `~/.cursor/plans/*.plan.md` (outside the repo).

Select plans whose **file contents** match any of these (case-insensitive):

- `jobzeug`
- `evidence/`
- `Workspace/Jobzeug`
- `add-project`
- `add-story`

For each match:

- Copy into `session-checkpoints/plans/` using the same basename
- Overwrite if the basename already exists
- Do **not** delete plans already in `session-checkpoints/plans/` that no longer match
- Do **not** invent, rewrite, or edit plan bodies
- Do **not** edit originals under `~/.cursor/plans/`

Set:

- `plans_cached` = `true` if at least one file was copied or updated this run; otherwise `false`
- Track basenames copied/updated for the session log

### 3. Write session log entry

Append to:

`session-checkpoints/session-log.md`

Create the file if missing (optional `# Session log` heading at top).

Template:

```markdown
### [{{timestamp}}]

#### Summary

- One or two sentence summary

#### Changes

- Evidence / records:
- Skills / tooling:
- Other:

#### Decisions

- Why key choices were made

#### Plans cached

- list of basenames copied/updated this run, or “none”

#### Next

- Next steps
```

Use an ISO-8601-style local timestamp.

### 4. Prevent duplication

If the latest entry matches the current session:

- **UPDATE** instead of append

Set:

- `session_logged` = `true` when the log was written or updated

### 5. Git commit + push

If there is anything to commit among:

- `evidence/`
- `.agents/skills/`
- `session-checkpoints/`
- `.gitignore`
- other intentional project files already tracked or clearly part of this workspace

Then perform a full Git check-in.

#### 5.1 Stage changes

Stage intentionally (examples):

```bash
git add evidence/ .agents/skills/ session-checkpoints/ .gitignore
```

Add other relevant paths only when they changed and belong in the repo.

Never stage:

- `.env`
- `.env.*`
- secrets, credentials, or Contentful backup dumps covered by `.gitignore`

Do **not** use blind `git add -A` if it would pick up ignored or secret files; prefer explicit paths. Rely on `.gitignore`.

#### 5.2 Generate commit message

Build a structured commit message:

`type(scope): summary`

Type rules:

- `feat` → new functionality or substantial evidence/skill additions
- `fix` → bug fixes
- `chore` → session log / plan cache / housekeeping only
- `docs` → documentation-only when that is the bulk of the change

Scope rules (Jobzeug):

- `evidence` — evidence records, indexes, Goal/README
- `skills` — `.agents/skills/`
- `session` — session-checkpoints log and plan cache
- or combined if needed

Example:

```text
chore(session): checkpoint evidence capture and plan cache

Details:

- Cached Jobzeug Cursor plans into session-checkpoints/plans/
- Appended session log
```

#### 5.3 Commit

```bash
git commit -m "$(cat <<'EOF'
<generated message>

EOF
)"
```

Follow the user’s git commit HEREDOC convention when committing.

#### 5.4 Push

```bash
git push
```

Push to `origin` (default branch tracking).

#### 5.5 Safeguards

- If no changes → skip commit; set `committed` = `false`
- If commit fails → do not retry blindly; set `committed` = `false`
- If push fails → set `pushed` = `false` and still return JSON
- If commit succeeded and push succeeded → `committed` = `true`, `pushed` = `true`
- If commit succeeded but push was skipped (nothing to push / no remote needed) → set booleans accurately

Set:

- `committed` = `true` | `false`
- `pushed` = `true` | `false`

---

## Output

Return **only** the JSON object below (no surrounding markdown fence, no other text):

```json
{
  "plans_cached": true,
  "committed": true,
  "pushed": true,
  "session_logged": true
}
```

Each value is a boolean reflecting what actually happened this run.
