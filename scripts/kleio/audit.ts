import path from "node:path";

import { auditKleio, formatKleioAudit } from "../../src/lib/kleio/audit";

const indexPath = path.resolve(process.cwd(), "evidence/projects/INDEX.md");

auditKleio(indexPath)
  .then((audit) => {
    process.stdout.write(`${formatKleioAudit(audit)}\n`);
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
