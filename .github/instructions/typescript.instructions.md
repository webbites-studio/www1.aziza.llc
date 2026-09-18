---
description: "Use when writing TypeScript in src: ESM import extensions, strict compiler settings, ES2020 target limits, HTML escaping, and the no-dependency rule."
applyTo: "src/**/*.ts"
---

# TypeScript Rules

## Imports

Relative imports **must** carry the `.js` extension, even in `.ts` files — the output runs directly in the browser as ESM:

```ts
import { BaseComponent } from '../components/base-component.js';   // correct
import { BaseComponent } from '../components/base-component';      // breaks at runtime
```

Type-only imports use `import type { … }` (`verbatimModuleSyntax` is enabled).

## No external packages

`src/` imports nothing but local modules and standard browser APIs. If a helper is missing, write it in `src/utils/`.

## Compiler constraints

- **Target is ES2020.** Do not use newer APIs (`Object.groupBy`, `Array.prototype.findLast`, `structuredClone` assumptions). Prefer a `reduce` or an explicit loop.
- **`noUncheckedIndexedAccess`** is on for builds: `array[0]` and `string[0]` are possibly `undefined`. Guard the value or use `.charAt(0)` / `.at()` with a fallback. Do not silence it with `!`.
- **`strict`** is on. Avoid `any`; type DOM queries via the generic (`this.query<HTMLInputElement>(…)`).

`npm run lint` (typecheck) and `npm run build` must both pass before you are done.

## Rendering safety

Components build HTML strings and assign them to `innerHTML`. Every interpolated value that could contain user or stored data goes through `escapeHtml()` from `src/utils/portal-helpers.ts`:

```ts
`<strong>${escapeHtml(customer.email)}</strong>`
```

Static literals and numbers are fine unescaped; anything from state, storage, or a form is not.

## Style

Keep files focused on one responsibility. Do not add doc comments that restate the code — comment only what the code cannot show.
