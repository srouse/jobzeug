# ds2.figma.components.node.remediate (planned CLI)

Bridge **`componentNodeRemediate`** — **one Figma `nodeId` per call**, ordered **`changes[]`** (typed style / binding events). **Not** coupled to **`runComponentLint`**; agents MAY use lint JSON only to choose targets. Normative: **`specs/005-ds2-figma-linting/contracts/component-node-remediate.md`**.

## When to use

You need to apply explicit fills, strokes, padding, variable bindings, text/effect styles, or literals to **one layer** at a time. For **multiple** nodes, repeat this flow **per `nodeId`** (no multi-node batch in v1).

## Prerequisites

- **`ds2.config.json`** **`figmaLibraryId`**, DS2 plugin open on the library file, valid **`figma.fileKey`**.
- **`changes[]`** built so each row has a documented **`kind`** and fields the plugin can resolve (variable id, style id, or literal per contract).

## Steps (agent loop)

1. **`cd`** to the package root.
2. Collect target **`nodeId`** values (from **`runComponentLint --json`**, Figma UI copy, or other tools).
3. For **each** **`nodeId`**, build **`changes[]`** for **that node only**.
4. **Preview:** send bridge **`componentNodeRemediate`** with **`dryRun: true`** (CLI TBD; mirrors preview-by-default pattern).
5. **Execute:** **`dryRun: false`** (e.g. **`--apply`** when CLI exists).
6. On failure for one node, retry or fix payload; other nodes are unaffected (separate calls).

## Related

- **`specs/005-ds2-figma-linting/contracts/component-node-remediate.md`**
- **`specs/004-ds2-figma-integration/contracts/bridge-protocol.md`** — **`componentNodeRemediate`**
