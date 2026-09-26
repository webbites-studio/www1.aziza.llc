# Aziza Astana Concierge Portal

Single-page portal built on a **custom, dependency-free TypeScript framework**. No React, no bundler, no runtime npm packages — plain ES modules compiled by `tsc` and served as static files.

See [docs/README.md](../docs/README.md) for features, demo accounts, and Docker deployment.

## Non-Negotiables

1. **No runtime dependencies.** `dependencies` stays empty. Dev tooling is only `typescript` + `browser-sync`. Never add a bundler, UI framework, CSS library, or icon package.
2. **Repo root holds only project and config files.** No source, HTML, CSS, or images at the root.
3. **All static assets live in `public/`.** Never place `.css`, `.html`, or images under `src/`.
4. **OAuth2 is dormant, not dead.** `src/auth/`, `src/services/auth-service.ts`, `src/state/auth-state.ts`, and `src/api/` must keep compiling and stay wired into bootstrap and the router. Do not delete or gut them to simplify the local login.
5. **Use the framework.** Pages extend the framework base classes and are registered in `src/pages/router.ts`. Never re-centralize the UI into one large file.

## Layout

| Path | Purpose |
| --- | --- |
| `src/index.ts` | Bootstrap: API config, theme, viewport, auth state, auth service, router — keep all of them |
| `src/pages/` | One file per page, plus `router.ts` |
| `src/components/` | Reusable UI, including `base-component.ts` and `portal-layout.ts` |
| `src/state/` | Pub/sub state built on `global-state.ts` |
| `src/utils/`, `src/types/` | Shared helpers and types |
| `src/portal-data.ts`, `src/state/portal-state.ts` | **Temporary** local data and persistence; deleted once a backend exists |
| `public/` | `index.html`, `css/`, images; `public/dist/` is generated output |
| `test/` | `node:test` suites that run against `public/dist` |

## Commands

```bash
npm run build   # tsc -p tsconfig.build.json -> public/dist
npm run lint    # tsc -p tsconfig.json (typecheck only)
npm test        # build, then node --test test/*.test.mjs
npm run dev     # browser-sync on http://localhost:3000
```

Always run `npm run build` (or `npm test`) after editing TypeScript — the browser loads `public/dist`, not `src`.

## TypeScript Configuration

| File | Role |
| --- | --- |
| `tsconfig.json` | Editor and typecheck, `noEmit` |
| `tsconfig.build.json` | Emits to `public/dist`, adds `noUncheckedIndexedAccess` |
| `tsconfig.test.json` | Typechecks `src` and `test` together |

## Conventions

- ESM with **`.js` extensions** on relative imports (`./portal-state.js`) even in `.ts` files.
- Target is ES2020 — do not use newer APIs such as `Object.groupBy`.
- `noUncheckedIndexedAccess` is enabled: guard array and string indexing instead of asserting with `!`.
- Escape interpolated values with `escapeHtml()` from `src/utils/portal-helpers.ts` before inserting them into `innerHTML`.
- Demo credentials are intentionally local and fake. Never add real secrets, tokens, or customer data to the repo.
