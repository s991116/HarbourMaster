---
name: deploy
description: >-
  Build and deploy HarbourMaster to Cloudflare Pages. Use when changing
  vite config, wrangler, redirects, or hosting/DNS.
---

# Deploy HarbourMaster

## Before you start

- [docs/specs/deployment.md](../../../docs/specs/deployment.md)
- Full runbook: [DEPLOY.md](../../../DEPLOY.md)

## Local verify

```bash
npm install
npm run build
npm run preview
```

Confirm app loads at preview URL; check browser console for 404 on assets.

## Cloudflare Pages (Dashboard)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Node 22 (`.nvmrc`)
4. Custom domain: `harbour.sailboatadventure.dk` → CNAME `harbourmaster.pages.dev`

## After deploy

```bash
dig harbour.sailboatadventure.dk CNAME +short
```

Expect `harbourmaster.pages.dev.`

## If build fails in CI

- Read workflow logs (if using GitHub Actions).
- Ensure no custom `base` in `vite.config.ts`.
- Secrets only needed for Actions deploy path — see DEPLOY.md.
