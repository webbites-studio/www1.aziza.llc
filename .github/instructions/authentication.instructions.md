---
description: "Use when touching authentication, OAuth2, PKCE, tokens, auth guards, the generated API client, or when enabling the real login flow."
applyTo: ["src/auth/**/*.ts", "src/api/**/*.ts", "src/services/auth-service.ts", "src/state/auth-state.ts", "src/pages/login.ts", "src/pages/oauth-callback.ts"]
---

# Authentication Rules

## The OAuth2 flow is dormant, not removed

The portal currently signs in with temporary local demo credentials, but the full OAuth2 implementation stays in the repo and stays wired up:

- `src/index.ts` must keep calling `loadAuthState()` and `initializeAuthService()`.
- `router.ts` must keep the `/oauth/login` and `/auth/callback` routes.
- `auth-guard.ts`, `token-manager.ts`, and `oauth-manager.ts` must keep compiling.

Never delete, stub, or bypass these to simplify something else.

## Keep the two flows separate

| Concern | Lives in |
| --- | --- |
| Temporary local login | `src/pages/local-login.ts`, `src/state/portal-state.ts` |
| Real authentication | `src/auth/`, `src/services/auth-service.ts`, `src/state/auth-state.ts` |

Do not merge them, and do not make OAuth modules depend on the local session.

## Enabling OAuth later

Switch the portal routes from the `local-private` strategy to `oauth-private`, then retire the local login page and the temporary state — no page or component rewrite should be required.

## Generated API client

Everything in `src/api/*.gen.ts` and `src/api/**/*.gen.ts` is generated from the OpenAPI spec. Regenerate it instead of hand-editing. Configure the base URL only through `src/config.ts`.

## Secrets

No client secrets, tokens, or real customer data in this repo. PKCE exists precisely so the browser holds no secret.
