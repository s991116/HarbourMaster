# Deploy HarbourMaster to harbour.sailboatadventure.dk

Same hosting model as [app.sailboatadventure.dk](https://app.sailboatadventure.dk/) (Cloudflare Pages + CNAME at one.com).

## Option A — Cloudflare Dashboard (matches boatlog)

1. Log in at [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select **s991116/HarbourMaster**, branch **main**.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Node.js version: **20**
4. Project name: **harbourmaster** → preview URL: `https://harbourmaster.pages.dev`
5. **Custom domains** → add `harbour.sailboatadventure.dk`.
6. At **one.com** DNS for `sailboatadventure.dk`, add (same panel as the `app` record):

   | Type  | Host    | Target                 |
   |-------|---------|------------------------|
   | CNAME | harbour | harbourmaster.pages.dev |

7. Wait for SSL (usually 5–15 minutes), then open https://harbour.sailboatadventure.dk

## Option B — GitHub Actions (this repo)

Workflow: [`.github/workflows/deploy-cloudflare-pages.yml`](.github/workflows/deploy-cloudflare-pages.yml)

Add repository secrets at **GitHub → HarbourMaster → Settings → Secrets → Actions**:

| Secret | Value |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | API token with **Cloudflare Pages → Edit** (create at [API tokens](https://dash.cloudflare.com/profile/api-tokens)) |
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID (Dashboard → any zone → right sidebar, or Workers & Pages overview) |

Push to `main` or run the workflow manually. Then complete steps 5–7 from Option A for the custom domain and one.com DNS.

## Verify locally

```bash
npm ci
npm run build
npm run preview
```

## Troubleshooting

- **Blank page**: confirm build output is `dist` and no custom `base` in `vite.config.ts`.
- **DNS**: `dig harbour.sailboatadventure.dk CNAME` should show `harbourmaster.pages.dev`.
- **SSL pending**: wait and confirm the domain is **Active** on the Pages project.
