import fs from 'node:fs/promises';
import path from 'node:path';
import { parseDocument } from 'yaml';
import { projectMatchingSchema, matchingVocabularySchema, validateMatchingCatalog } from '../../contentful/matching-schema.mjs';

export function parseYaml(text, label) {
  const doc = parseDocument(text, { uniqueKeys: true, version: '1.2' });
  if (doc.errors.length || doc.warnings.length) throw new Error(`Invalid YAML in ${label}: ${[...doc.errors, ...doc.warnings].map(e => e.message).join('; ')}`);
  return doc.toJS({ maxAliasCount: 0 });
}

export function parseProjectHeader(markdown, expectedId) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error(`Missing matching header for ${expectedId}`);
  const metadata = projectMatchingSchema.parse(parseYaml(match[1], expectedId));
  if (metadata.project_id !== expectedId) throw new Error(`Project header ID mismatch for ${expectedId}`);
  const body = markdown.slice(match[0].length);
  for (const claim of metadata.evidence) for (const source of claim.sources) {
    if (source.ref.startsWith('#') && !body.includes(`<a id="${source.ref.slice(1)}"></a>`)) {
      throw new Error(`Missing source anchor ${source.ref} in ${claim.id}`);
    }
  }
  return { metadata, body };
}

export async function loadMatchingInputs(root) {
  const registry = matchingVocabularySchema.parse(parseYaml(await fs.readFile(path.join(root, 'evidence/matching/vocabulary.yaml'), 'utf8'), 'vocabulary.yaml'));
  const projects = new Map();
  const dir = path.join(root, 'evidence/projects');
  for (const file of (await fs.readdir(dir)).filter(f => /^S\d+.*\.md$/.test(f)).sort()) {
    const id = file.match(/^(S\d+)/)[1];
    projects.set(id, parseProjectHeader(await fs.readFile(path.join(dir, file), 'utf8'), id));
  }
  validateMatchingCatalog([...projects.values()].map(p => p.metadata), [registry]);
  return { registry, projects };
}
