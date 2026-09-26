#!/usr/bin/env node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createClient } from 'contentful-management';
import { createClient as deliveryClient } from 'contentful';
import { requireContentfulEnv } from './env.mjs';
import { fetchMatchingCatalog } from '../../contentful/matching-catalog.mjs';

async function main() {
  const {space, environment, token, locale} = requireContentfulEnv();
  const client = createClient({accessToken:token});
  const params = {spaceId:space, environmentId:environment};
  const ids = ['jz-S004','jz-S005','jz-S006','jz-S007','jz-MV-1.0.0'];
  const entries = await Promise.all(ids.map(entryId => client.entry.get({...params,entryId})));
  for (const e of entries) if (!e.sys.publishedVersion || e.sys.version > e.sys.publishedVersion+1) throw new Error(`Unpublished changes: ${e.sys.id}`);
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'jobzeug-retire-s004-'));
  await fs.writeFile(path.join(dir,'before.json'),JSON.stringify({space,environment,entries},null,2),{mode:0o600});
  console.log(`Backup: ${dir}/before.json`);
  for (const e of entries.slice(1)) {
    const fields=structuredClone(e.fields);
    if(e.sys.id==='jz-MV-1.0.0') {
      fields.registry[locale].project_sources.S004='../roles/R004-state-farm-design-systems.md#state-farm-design-system-context';
    } else {
      assert.equal(fields.matchingMetadata[locale].parent_project_id,'S004');
      fields.matchingMetadata[locale].parent_project_id=null;
    }
    const p={...params,entryId:e.sys.id};
    const updated=await client.entry.update(p,{...e,fields});
    await client.entry.publish(p,updated);
    const current=await client.entry.get(p);
    assert.deepEqual(current.fields,fields);
    assert.deepEqual(current.metadata,e.metadata);
  }
  const p={...params,entryId:'jz-S004'};
  const unpublished=await client.entry.unpublish(p);
  await client.entry.archive(p,unpublished);
  const archived=await client.entry.get(p);
  assert.ok(archived.sys.archivedVersion);
  assert.deepEqual(archived.fields,entries[0].fields);
  const catalog=await fetchMatchingCatalog(deliveryClient({space,environment,accessToken:process.env.CONTENTFUL_DELIVERY_TOKEN}),{locale});
  assert.equal(catalog.projects.size,21);
  assert.equal(catalog.projects.has('S004'),false);
  for(const id of ['S005','S006','S007']) assert.equal(catalog.projects.get(id).parent_project_id,null);
  console.log('Verified: S004 archived with content intact; 21 published projects load; no S004 parent references.');
}
main().catch(e=>{console.error('Retirement failed:',e.name,e.name==='Error'?e.message:e.status||e.code||'');process.exitCode=1;});
