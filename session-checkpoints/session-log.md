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
