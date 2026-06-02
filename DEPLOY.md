# Deploy HarbourMaster to harbour.sailboatadventure.dk

Same hosting model as [app.sailboatadventure.dk](https://app.sailboatadventure.dk/) (Cloudflare Pages + CNAME at one.com).

## Recommended — Cloudflare Dashboard (same as boatlog)

1. Log in at [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select **s991116/HarbourMaster**, branch **main**.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Node.js version: **22** (or use `.nvmrc` in repo)
4. Project name: **harbourmaster** → live URL: `https://harbourmaster.pages.dev`
5. Wait for the first build to succeed, then open **Custom domains** → add `harbour.sailboatadventure.dk`.
6. In **one.com** DNS for `sailboatadventure.dk` (same place as the `app` → `boatlog.pages.dev` record):
   - **Remove** any `harbour` **A-record** pointing at one.com web hosting (e.g. `46.30.213.123`).
   - Add or update:

   | Type  | Host    | Target                 |
   |-------|---------|------------------------|
   | CNAME | harbour | harbourmaster.pages.dev |

7. Wait 5–15 minutes for SSL, then test https://harbour.sailboatadventure.dk

### Verify DNS

```bash
dig harbour.sailboatadventure.dk CNAME +short
# should show: harbourmaster.pages.dev.
```

## Optional — GitHub Actions deploy

Workflow: [`.github/workflows/deploy-cloudflare-pages.yml`](.github/workflows/deploy-cloudflare-pages.yml)

- **Build** runs on every push to `main` (validates the project in CI).
- **Deploy** runs only if these repository secrets exist:

| Secret | Value |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | API token with **Cloudflare Pages → Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | `a3413f869033d15b29634d0f74804877` (Philip.juhl@gmail.com account) |

If you use Dashboard Git integration only, you do not need these secrets.

## Local check

```bash
npm install
npm run build
npm run preview
```

## Troubleshooting

- **Blank page**: build output must be `dist`; no custom `base` in `vite.config.ts`.
- **Wrong site / one.com default page**: `harbour` must be **CNAME** to `harbourmaster.pages.dev`, not an A-record to one.com.
- **SSL pending**: wait; confirm domain is **Active** on the Pages project.
