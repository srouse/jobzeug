/** Contentful web editor URL for an entry sys id. */
export function contentfulEditorUrl(entryId: string): string | undefined {
  const space = process.env.CONTENTFUL_SPACE_ID?.trim();
  const environment = process.env.CONTENTFUL_ENVIRONMENT?.trim();
  const id = entryId.trim();
  if (!space || !environment || !id) return undefined;
  return `https://app.contentful.com/spaces/${encodeURIComponent(space)}/environments/${encodeURIComponent(environment)}/entries/${encodeURIComponent(id)}`;
}
