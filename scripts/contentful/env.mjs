import fs from 'node:fs';
import path from 'node:path';

/** Load repo-root `.env` into process.env without overwriting existing values. */
export function loadEnv(root = process.cwd()) {
  const file = path.join(root, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
      value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export function contentfulEnv({ required = true } = {}) {
  loadEnv();
  const space = process.env.CONTENTFUL_SPACE_ID?.trim();
  const environment = process.env.CONTENTFUL_ENVIRONMENT?.trim();
  const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN?.trim();
  const locale = process.env.CONTENTFUL_LOCALE?.trim() || 'en-US';
  if (required) {
    const missing = [
      !space && 'CONTENTFUL_SPACE_ID',
      !environment && 'CONTENTFUL_ENVIRONMENT',
      !token && 'CONTENTFUL_MANAGEMENT_TOKEN',
    ].filter(Boolean);
    if (missing.length) throw new Error(`Missing Contentful env: ${missing.join(', ')}. Set them in .env.`);
  }
  return { space, environment, token, locale };
}

export function requireContentfulEnv() {
  return contentfulEnv({ required: true });
}
