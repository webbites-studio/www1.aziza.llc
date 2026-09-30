---
description: "Use when writing or updating tests, node:test suites, or architecture regression checks in the test folder."
applyTo: "test/**/*.mjs"
---

# Testing Rules

## Runner

Node's built-in test runner only — `node:test` plus `node:assert/strict`. No Vitest, Jest, jsdom, or Testing Library; adding one violates the dependency-free rule.

Tests are plain `.mjs` files. `npm test` builds first, then runs `node --test test/*.test.mjs`.

## Test the build output

Import from the compiled output, not from `src`:

```js
import { cloneInitialCustomers } from '../public/dist/portal-data.js';
```

Anything requiring a live DOM belongs in manual browser verification instead — there is no DOM shim.

## Guard the architecture

Alongside behavior tests, keep the invariants that are easy to regress:

- every portal route stays registered in the compiled `router.js`
- `index.js` still calls `initializeTheme`, `initializeViewport`, `loadAuthState`, `initializeAuthService`, and `initializeRouter`
- the bundle contains no third-party imports
- the OAuth implementation is still present in the build

Reading the compiled file and asserting with a regex is acceptable for these structural checks.
