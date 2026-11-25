# Cloudflare Pages

Use Cloudflare Pages to host the AURA company site from the `public` directory.

## Deploy settings

- Framework preset: None
- Build command: leave blank
- Build output directory: `public`
- Root directory: repository root

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
