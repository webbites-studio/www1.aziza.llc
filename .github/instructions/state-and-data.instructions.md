---
description: "Use when changing shared state, pub/sub stores, localStorage persistence, seed data, translations, or planning the backend/database migration away from temporary local data."
applyTo: ["src/state/**/*.ts", "src/portal-data.ts"]
---

# State and Temporary Data Rules

## Temporary by design

`src/portal-data.ts` (seed customers and fallback rates) and `src/state/portal-state.ts` (runtime state + `localStorage`) exist **only until a backend and database land**. They are meant to be deleted.

To keep that removal cheap:

- No DOM access and no rendering logic in either file.
- Pages and components must read/write through `portal-state.ts` functions — never touch `localStorage` or import seed arrays directly for mutation.
- **Type definitions do not belong here.** They live in `src/types/portal-types.ts` so deleting this file does not break every importer. Those entity types mirror future API payloads and get repointed at generated `src/api` types when the backend lands.
- **Translations and currency symbols do not belong here either.** They are permanent UI/presentation concerns, not customer data — `translate()`/`translations` live in `src/utils/translations.ts` and `currencySymbols` lives in `src/utils/currency.ts`.
- **Dropdown option catalogs (`documentOptions`, `documentGroupOptions`, `appointmentOptions`, `serviceOptions`, `requestOptions`) live in `src/utils/portal-options.ts`.** They are permanent UI choice lists, not seed customer records — they will likely still exist (possibly server-configurable) after the backend lands, so they should not be deleted alongside the seed data.

## Store pattern

Build stores with `createState<T>()` from `./global-state.js` and export a narrow API: typed getters, intent-named actions, and a `subscribeTo*` function. Never export the raw store.

```ts
const portalState = createState<PortalState>({ /* ... */ });
export function getPortalState(): PortalState { return portalState.getState(); }
export function selectCustomer(id: number): void { portalState.setState({ selectedCustomerId: id }); }
```

Components subscribe in `onMount()` via `this.addSubscription(subscribeToPortalState(...))`.

## Persistence

Keys are `aziza-customers` and `aziza-language`. Always wrap `JSON.parse` of stored data in `try/catch` and fall back to seed data — corrupt storage must not break boot.

## Leave auth state alone

`auth-state.ts` and `theme-manager.ts` are framework modules for the dormant OAuth flow and theming. Do not repurpose them for the temporary local session.
