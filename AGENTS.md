# Agent Guide

The canonical, always-on rules for this repository live in
[.github/copilot-instructions.md](.github/copilot-instructions.md).

Task-scoped rules live in [.github/instructions/](.github/instructions/):

| File | Scope |
| --- | --- |
| `typescript.instructions.md` | `src/**/*.ts` — imports, strictness, escaping |
| `pages.instructions.md` | `src/pages/**` — one page per file, routing |
| `components.instructions.md` | `src/components/**` — `BaseComponent` lifecycle |
| `state-and-data.instructions.md` | `src/state/**`, `src/portal-data.ts` — temporary local data |
| `authentication.instructions.md` | `src/auth/**`, `src/api/**` — dormant OAuth2 |
| `static-assets.instructions.md` | `public/**` — assets and generated output |
| `testing.instructions.md` | `test/**` — `node:test` suites |

Read those files rather than restating them here, and keep this pointer in sync
if the instruction set changes.
