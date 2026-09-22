/** Public Contentful tags managed from Jobzeug. IDs are immutable once created. */
export const tagCatalog = {
  startup: { name: 'Startup' },
  enterprise: { name: 'Enterprise' },
  agency: { name: 'Agency' },
  insurance: { name: 'Insurance' },
  fintech: { name: 'Fintech' },
  cms: { name: 'CMS' },
  personal: { name: 'Personal' },
  health: { name: 'Health' },
  education: { name: 'Education' },
  aggregate: { name: 'Resume aggregate' },
  linkedinDetail: { name: 'LinkedIn detail' },
  media: { name: 'Media' },
};

export const tagIds = Object.keys(tagCatalog);

export function assertTagIds(ids) {
  const unknown = ids.filter(id => !tagCatalog[id]);
  if (unknown.length) throw new Error(`Unknown tag IDs: ${unknown.join(', ')}`);
  return [...new Set(ids)];
}
