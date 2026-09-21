# Session log

Running log of Jobzeug session checkpoints. Entries are appended by the `session-checkpoint` skill.

### [2026-09-20T12:07:57-05:00]

#### Summary

- First Jobzeug session checkpoint: evidence model (projects/roles), add-project skill, and adapted session-checkpoint skill committed with plan cache.

#### Changes

- Evidence / records: stories→projects and experience→roles renames; employers/customers/clients/perspectives; S001–S008 projects; entity model in evidence/README.md
- Skills / tooling: add-project skill; session-checkpoint rewritten for Jobzeug (no SpecKit); session-checkpoints folder seeded
- Other: .gitignore for Next.js/env/Contentful backups

#### Decisions

- S00x kept as project IDs (historical prefix); R00x as roles; SpecKit and deck scopes dropped from checkpoint skill; plans cached by content match into session-checkpoints/plans/

#### Plans cached

- add_story_skill_2a282f5c.plan.md
- customers_evidence_log_51450833.plan.md
- session_checkpoint_skill_65575be3.plan.md
- stories_to_projects_rename_34704978.plan.md

#### Next

- Continue project capture; invoke session-checkpoint at end of sessions

### [2026-09-20T12:13:05-05:00]

#### Summary

- Redacted Greenhouse job-board ENV tokens in the saved HTML snapshot to clear the GitGuardian Rollbar false positive on HEAD.

#### Changes

- Evidence / records: Replaced Rollbar/geocode/Google/Dropbox/reCAPTCHA values with REDACTED in original.html; job posting body unchanged
- Skills / tooling:
- Other:

#### Decisions

- Keep the HTML provenance snapshot; redact only credential-shaped ENV values (Greenhouse public client keys, not Jobzeug secrets)

#### Plans cached

- none

#### Next

- Resolve GitGuardian incident as false positive / fixed on tip if desired; history still contains prior commit

### [2026-09-21T11:34:02-05:00]

#### Summary

- Moved project skills from `.cursor/skills/` to `.agents/skills/` and checkpointed the relocation.

#### Changes

- Evidence / records:
- Skills / tooling: add-project and session-checkpoint now under `.agents/skills/`; removed `.cursor/skills/` copies
- Other:

#### Decisions

- Use `.agents/skills/` as the canonical skill location for Jobzeug (session-checkpoint staging paths updated accordingly)

#### Plans cached

- none

#### Next

- Continue evidence capture; invoke session-checkpoint at end of sessions
