# Matching data in Contentful

The compression pipeline publishes structured project evidence and its controlled vocabulary to Contentful. The future ranking engine can load validated data through the Delivery API without asking an AI to interpret Markdown or invent tags. Scoring itself is still specified in [the engine contract](../evidence/matching/engine.md), not implemented here.

## Storage contract

| Content type | Field | Contents |
|---|---|---|
| `jobzeugProject` | `matchingMetadata` (Object) | Complete schema 1.1 project header, including project ID, year and basis, relationships, ranking eligibility, evidence claims, concept IDs, ownership, review, provenance, and disclosure |
| `jobzeugMatchingVocabulary` | `registry` (Object) | Complete controlled vocabulary, categories, definitions, aliases, relationships, review state, and O*NET mappings |
| `jobzeugMatchingVocabulary` | `evidenceId`, `vocabularyVersion`, `name` | Stable identity and editor-facing name; initially `MV-1.0.0` / `1.0.0` |

There are 21 active project entries within `jz-S001` through `jz-S022`; `jz-S004` is retired and archived. Its complete narrative and original header are preserved in [State Farm role context](../evidence/roles/R004-state-farm-design-systems.md#state-farm-design-system-context). S005–S007 have no parent project and retain their peer relationships. Do not reuse S004 or recreate its output. The initial vocabulary entry is `jz-MV-1.0.0`. Each project's `annotation.vocabulary_version` pins its registry version. When introducing a new version, retain any published version still referenced by projects; the push script does not delete old entries.

These are JSON Object fields editable in Contentful. Nested validation lives in [matching-schema.mjs](matching-schema.mjs): Contentful's Object field does not enforce that full contract in the editor. Invalid edits will be rejected when the catalog is loaded. Use the [header schema](../evidence/matching/project-header-schema.md) when editing. Year remains a single integer or null; no dates are invented.

Concept IDs are stored inside claims, not converted into Contentful metadata tags. Existing tags and role visibility settings have a separate purpose. Projects no longer have startDate, endDate, highlights, technologies, url, or showOnResume fields. The project model consists of evidenceId, employer, roles, name, summary, and matchingMetadata. Source references remain provenance pointers to evidence documents; the loader does not open those documents at runtime.

## Authoring and publishing

Markdown headers and `evidence/matching/vocabulary.yaml` are the repository authoring source. Compression validates the entire graph before writing outputs, preserves the structured values, and strips frontmatter before extracting resume prose.

Generated files:

- `evidence/outputs/projects/S*.json`: resume fields plus `matchingMetadata`.
- `evidence/outputs/matchingVocabularies/MV-1.0.0.json`: registry payload.

For a metadata-only update:

```sh
npm run contentful:compress
npm run contentful:apply -- --matching-only --dry-run
npm run contentful:push -- --matching-only --dry-run
npm run contentful:apply -- --matching-only
npm run contentful:push -- --matching-only
```

The scoped apply adds the project field and manages the vocabulary type. Scoped push requires existing published projects, rejects entries with unpublished changes, preserves other project fields/locales/tags, and publishes the matching metadata and vocabulary. Dry runs validate local inputs and show planned operations; they do not inspect remote drafts. Full `contentful:apply` / `contentful:push` retain their wider synchronization scope, now including matching data.

You can edit the JSON in Contentful and publish it. The Delivery API then supplies that published version, subject to Contentful propagation/caching. **Bring those edits back into the corresponding YAML before the next repo push:** synchronization is one-way and replaces matching metadata for the configured locale. There is no automatic reverse sync or merge. A vocabulary definition change should receive a new version and corresponding project pins.

## Runtime consumption

Server code calls `loadMatchingCatalog()` from `src/lib/contentful/matching.ts`. It uses the configured `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, `CONTENTFUL_DELIVERY_TOKEN`, and optional `CONTENTFUL_LOCALE` (default `en-US`). No management token is needed to read.

The loader:

1. Paginates all published projects and vocabulary entries via CDA.
2. Validates schemas, entry identities, vocabulary pins, approved concept references, and project relationships.
3. Returns `projects` and `vocabularies` Maps, `pendingProjectIds`, `excludedProjectIds`, and entry `revisions`.

It includes all published projects, retains pending review and disclosure states, and fails explicitly on missing or invalid metadata. It does not silently discard bad records, guess missing values, or score projects. The scoring implementation must apply the engine's eligibility, review, weighting, and disclosure rules. The existing resume response does not include the full matching metadata. Disclosure labels describe allowed use; they are not Contentful access controls.

The underlying CDA loader is [matching-catalog.mjs](matching-catalog.mjs); it has no filesystem or AI fallback. An application can use the returned revisions to identify the published inputs used for a ranking run.

## Validation

```sh
node --test scripts/contentful/matching.test.mjs
```

Tests cover header/compression/CMA/CDA round trips, vocabulary and ID validation, pagination, uncertain years, personal attribution, pending review, retired umbrella relationships, and preservation of existing CMS fields during scoped updates.

## Retired project fields

`node scripts/contentful/cleanup-project-fields.mjs` removes the six retired project fields from the live model and entries without replacing retained content from local files. It checks for unpublished changes, saves a temporary backup, omits the fields before deleting them, republishes affected entries, and verifies retained fields and tags. `--dry-run` performs preflight and backup only. Role fields are unaffected. See [Contentful field deletion](https://www.contentful.com/developers/docs/references/content-management-api/content-types/) for the required omit/publish/delete sequence.
