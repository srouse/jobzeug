---
name: Wire Local DS2 CLI
overview: Give `@jobzeug/design-system` a local `file:` dependency on the unpublished DS2 CLI at the sibling `d2s-design-system-squared` repo, plus npm scripts so you can run `ds2` from the design-system package without a registry.
todos:
  - id: file-dep
    content: "Add file: dep on sibling DS2 CLI to design-system package.json + ds2 scripts (package + root)"
    status: completed
  - id: docs-verify
    content: Document sibling path / build requirement in DS README; npm install + npm run ds2 -- --help
    status: completed
isProject: false
---

# Wire local DS2 CLI into Jobzeug design-system

## Layout (already true)

```text
/Users/scottrouse/Workspace/Jobzeug/
  jobzeug/                          # this repo
    packages/design-system/
  d2s-design-system-squared/        # sibling, unpublished
    packages/cli/                   # bin: ds2 → dist/index.js
```

CLI package name: `@contentful/design-system-squared-agent-kit` ([`packages/cli/package.json`](/Users/scottrouse/Workspace/Jobzeug/d2s-design-system-squared/packages/cli/package.json)). Built `dist/` is self-contained (workspace `@ds2/*` are build-time only), so a `file:` link to the CLI package is enough.

## Changes

### 1. Dependency on [`packages/design-system/package.json`](packages/design-system/package.json)

Add a **devDependency** (CLI tooling, not shipped to Next):

```json
"@contentful/design-system-squared-agent-kit": "file:../../../d2s-design-system-squared/packages/cli"
```

Path is relative to the design-system package. After `npm install` at the Jobzeug root, the `ds2` bin is available to that workspace.

### 2. Scripts

In design-system `package.json`:

```json
"ds2": "ds2"
```

In root [`package.json`](package.json):

```json
"ds2": "npm run ds2 -w @jobzeug/design-system --"
```

Usage:

```bash
npm run ds2 -- status
npm run ds2 -- init --ai cursor
# or from the package: npm run ds2 -w @jobzeug/design-system -- status
```

### 3. Docs

Short note in [`packages/design-system/README.md`](packages/design-system/README.md):

- Sibling path expectation: `../d2s-design-system-squared`
- If `ds2` fails on missing `dist`, build CLI in the sibling repo (`pnpm build` / filter the agent-kit package) then reinstall
- DS2 looks for `ds2.config.json` next to the cwd package; create via `ds2 init` when you start using capture/implement (not required just to invoke the binary)

### 4. Verify

- `npm install` at Jobzeug root (resolves `file:`)
- `npm run ds2 -- --help` (or `status`) exits successfully

## Out of scope

- Vendoring DS2 into this monorepo
- Running `ds2 init` / Figma bridge / capturing Blue Button (CLI access only this pass)
- Changing Lit `jz-button` or Specs (already removed)
