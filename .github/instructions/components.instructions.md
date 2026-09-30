---
description: "Use when building or changing reusable UI components, BaseComponent lifecycle, rendering, event listeners, or responsive behavior in src/components."
applyTo: "src/components/**/*.ts"
---

# Component Rules

Reusable UI belongs here — never inside a page file. Every component extends `BaseComponent<TState>`.

## Lifecycle contract

- `render()` rebuilds `this.root.innerHTML`, so **re-attach listeners at the end of every `render()`**. `setState()` removes existing listeners before re-rendering.
- `onMount()` for subscriptions and initial data loading.
- `onDestroy()` for cleanup the framework cannot infer.

## Let the framework clean up

| Use | Not |
| --- | --- |
| `this.addEventListener(el, 'click', fn)` | `el.addEventListener(...)` |
| `this.addSubscription(unsubscribe)` | storing unsubscribes manually |
| `this.query()` / `this.queryAll()` | `document.querySelector` |

Never attach listeners to `document` or `window` directly — they outlive the component.

## Child components

Construct and `mount()` children inside `render()`, keep a field reference, and `destroy()` them in `onDestroy()` (and before re-creating them). Leaked children keep stale subscriptions alive.

```ts
const host = this.query<HTMLElement>('[data-component="language"]');
if (host) { this.languageSelect = new LanguageSelect(host); this.languageSelect.mount(); }
```

## Responsive behavior

Use `this.isMobile()`, `this.isDesktop()`, or `onViewportChange()`. Layout that CSS can express belongs in `public/css`, not in JavaScript.

## Escaping

Any value interpolated into `innerHTML` goes through `escapeHtml()` from `../utils/portal-helpers.js`.
