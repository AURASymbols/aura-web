# Cloudflare Workers (static assets)

Host the AURA company site from `public/` via Workers static assets (`wrangler.toml`).

## Production Worker

- Worker name: `aura-web` (owns `aurasymbol.com`)
- Production Git branch: `cloudflare-pages-prep`
- Build command: `npm run build:static` (or blank)
- **Deploy command: `npx wrangler deploy`** (not `wrangler preview`)
- Root directory: `/`

`wrangler preview` fails production cutover and does not update the live custom domain.

## Domain

Do **not** attach `aurasymbol.com` until a preview deploy looks correct.

When ready, follow [go-live-aurasymbol.md](go-live-aurasymbol.md).

## API limitation

Pages serves static files only. Express routes under `/api/*` will not run on Pages until they are moved to Pages Functions/Workers or a separate Node host.

Expected on a static-only deploy:

- Company pages work
- `/status.html` may show API unavailable
- NFT verification / identity APIs unavailable until backend hosting exists

This must not be described as a full backend production deployment.
