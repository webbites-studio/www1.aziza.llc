---
description: "Use when adding, splitting, or editing portal pages, routes, route guards, or navigation in src/pages."
applyTo: "src/pages/**/*.ts"
---

# Page and Routing Rules

## One page per file

Every route gets its own file. Never combine multiple pages, their markup, or their form handlers into a single module.

Authenticated portal pages extend `PortalLayout` (from `../components/portal-layout.js`), which already mounts the sidebar, topbar, profile strip, and admin back-link:

```ts
export class DocumentsPage extends PortalLayout {
  protected readonly view = 'documents' as const;

  protected renderPageContent(): string { /* page markup only */ }
  protected attachPageEvents(contentRoot: HTMLElement): void { /* page listeners */ }
}
```

Only override `onAddCustomer()` when the page owns the "Add customer" action. Do not re-render the shell from a page.

## Register the route

Add the page to the `routes` array in `router.ts` with a strategy:

| Strategy | Meaning |
| --- | --- |
| `local-private` | Requires the temporary local session |
| `local-guest` | Only when no local session (e.g. `/login`) |
| `oauth-private` | Reserved for the dormant OAuth flow |
| `oauth-guest` | OAuth login page |
| `anyone` | No guard (`/auth/callback`) |

## Navigate through the router

Use `navigateTo(path, 'push' \| 'replace')` from `../utils/navigation.js`, or a real `<a href="/route">`. Never use `window.location.href`, and never swap page content manually.

## Do not disturb the dormant OAuth pages

`login.ts` and `oauth-callback.ts` belong to the OAuth2 flow. Keep them compiling and routed; change them only when deliberately enabling OAuth.
