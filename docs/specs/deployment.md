# Deployment and hosting

**Status:** `active`  
**Detailed runbook:** [DEPLOY.md](../../DEPLOY.md)  
**Source:** `vite.config.ts`, `wrangler.toml`, `public/_redirects`

## Purpose

Static production build hosted on **Cloudflare Pages** with custom domain `harbour.sailboatadventure.dk`.

## Build

| Step | Command / output |
|------|------------------|
| Install | `npm install` |
| Build | `npm run build` → `dist/` |
| Local preview | `npm run preview` |
| Node | 22 (`.nvmrc`) |

- No custom `base` in Vite (avoids blank page at root/subpath).
- `wrangler.toml`: `pages_build_output_dir = "dist"`, project name `harbourmaster`.

## Hosting

- Primary: Cloudflare Dashboard → Pages → Git integration (`main`).
- Alternative: GitHub Actions deploy if secrets are set — see DEPLOY.md.
- SPA redirects: `public/_redirects` (Cloudflare Pages format).

## DNS (production)

- `harbour.sailboatadventure.dk` → CNAME `harbourmaster.pages.dev`
- Remove A-record to one.com web host for `harbour` host.

## Acceptance criteria

- [ ] `npm run build` completes without errors; `dist/index.html` exists.
- [ ] `npm run preview` shows the app locally.
- [ ] Production loads assets from root (no 404 on JS/CSS).
- [ ] Custom domain SSL Active on Pages project.

## Troubleshooting

See DEPLOY.md (blank page, wrong DNS, SSL pending).
