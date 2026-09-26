---
description: "Use when adding or editing static assets, index.html, CSS, images, fonts, or anything served from the public folder."
applyTo: "public/**"
---

# Static Asset Rules

`public/` is the web root — BrowserSync serves it in development and Nginx serves it in the container.

## Placement

| Item | Location |
| --- | --- |
| Markup | `public/index.html` (the only HTML file) |
| Stylesheets | `public/css/*.css` |
| Images, icons, fonts | `public/` |
| Compiled JavaScript | `public/dist/` (**generated**) |

Never put assets in `src/`, and never add HTML, CSS, or images to the repo root.

## `public/dist` is generated

It is the `tsc` output directory and is git-ignored. Never hand-edit files there and never fix a bug by patching compiled output — change `src/` and run `npm run build`.

## Reference assets from the root

Use root-relative paths (`/css/App.css`, `/sheraton-astana.jpg`, `/dist/index.js`) so deep routes like `/documents` resolve correctly under the SPA fallback.

## External resources

The dependency-free rule is about **npm packages and runtime code**, not media. The existing design deliberately loads Google Fonts (DM Sans, Newsreader) and hotlinks Unsplash/Wikimedia photography — leave those as they are unless asked. Do not add remote **script** dependencies.

## CSS

Plain CSS only, no preprocessor. Reuse the existing design tokens in `public/css/index.css` (`--green`, `--coral`, `--ink`, `--line`, …) rather than hardcoding colors, and keep responsive rules in the existing breakpoint blocks.
