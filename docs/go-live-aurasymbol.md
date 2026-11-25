# Go-live — aurasymbol.com

Company site cutover status for `aurasymbol.com`.

## Current state

| Item | Status |
|---|---|
| Company website (dark editorial) | **Live** |
| Host | Cloudflare Worker `aura-web` (`npx wrangler deploy`) |
| Canonical URLs / sitemap / robots | Point to `https://aurasymbol.com` |
| Old route redirects (`nft`, `brief`, `developer-guide`) | Ready (`_redirects` + Express) |
| Domain DNS → Cloudflare | **Done** |
| Production HTTPS on aurasymbol.com | **Active** |
| Live API on custom domain | Phase 2 (static-first; `/api` needs Node host) |
| Company email `ceo@aurasymbol.com` | Routing enabled; Gmail destination unreliable for external forwards |

## Deploy

```bash
npx wrangler deploy
```

Worker name must stay `aura-web` so the custom domain keeps serving this site. Details: [CLOUDFLARE_PAGES.md](CLOUDFLARE_PAGES.md).

## API note

`/api/*` needs a Node runtime. The Worker currently serves static files from `public/`.

Options:

1. **Phase 1 (now):** Company site static. Status page may show API unavailable until Phase 2.
2. **Phase 2:** Run `server.js` on a small Node host (Railway / Render / Fly) and proxy `/api/*`, or keep status optional until RPC/DB are configured.

## Cutover checklist

- [x] Deploy company site to Worker `aura-web`
- [x] Attach `aurasymbol.com` (+ `www` if used)
- [x] Confirm HTTPS cert active
- [x] Open `https://aurasymbol.com/` — hero, nav, collection, contact
- [ ] Confirm redirects: `/nft.html` → collection, `/brief.html` → about
- [ ] Confirm `https://aurasymbol.com/sitemap.xml` and `/robots.txt`
- [ ] Update X bio / OpenSea / GitHub website field to aurasymbol.com
- [ ] Post a short public update: “Company site live at aurasymbol.com”
- [ ] Stabilize `ceo@` delivery (non-Gmail destination or Workspace)

## Rollback

Point the custom domain away from `aura-web`, or redeploy a prior Worker version. The repository remains the source of truth.
