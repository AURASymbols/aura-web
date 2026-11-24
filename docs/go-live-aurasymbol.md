# Go-live — aurasymbol.com

AURA company site is ready in this repository. The domain is **not connected yet**. This checklist is the cutover path.

## Current state

| Item | Status |
|---|---|
| Company website (dark editorial) | Ready in repo |
| Canonical URLs / sitemap / robots | Point to `https://aurasymbol.com` |
| Old route redirects (`nft`, `brief`, `developer-guide`) | Ready (`_redirects` + Express) |
| Domain DNS → hosting | **Not done** |
| Production HTTPS on aurasymbol.com | **Blocked on DNS** |
| Live API on custom domain | Depends on host choice |

## Recommended host (simple)

**Cloudflare Pages** for the public static company site.

1. Cloudflare Dashboard → Workers & Pages → Create → Connect GitHub `AURASymbols/aura-web`
2. Build settings:
   - Framework preset: None
   - Build command: *(leave empty)*
   - Build output directory: `public`
3. Deploy from branch `development/aura-v3.5-cinematic` (or `main` after merge)
4. Custom domains → Add `aurasymbol.com` and `www.aurasymbol.com`
5. Cloudflare will show DNS records to add at your registrar (or manage DNS in Cloudflare)

### DNS (typical)

If the domain is on Cloudflare DNS:

| Type | Name | Target |
|---|---|---|
| CNAME | `@` / aurasymbol.com | *(Pages assignment Cloudflare provides)* |
| CNAME | `www` | `aurasymbol.com` or Pages hostname |

If the domain stays at another registrar, point nameservers to Cloudflare, or add the CNAME/A records Cloudflare Lists.

## API note

`/api/*` needs a Node runtime. Cloudflare Pages alone serves static files from `public/`.

Options:

1. **Phase 1 (now):** Ship the company site static. Status page will show API unavailable until Phase 2.
2. **Phase 2:** Run `server.js` on a small Node host (Railway / Render / Fly) and proxy `/api/*` to it, **or** keep status as “optional” until RPC/DB are configured.

Do not block domain cutover on Phase 2. The company site is the priority proof of presence.

## Cutover checklist

- [ ] Merge company-site branch to the production deploy branch
- [ ] Create Cloudflare Pages project with output `public`
- [ ] Attach `aurasymbol.com` + `www`
- [ ] Confirm HTTPS cert active
- [ ] Open `https://aurasymbol.com/` — hero, nav, collection, contact
- [ ] Confirm redirects: `/nft.html` → collection, `/brief.html` → about
- [ ] Confirm `https://aurasymbol.com/sitemap.xml` and `/robots.txt`
- [ ] Update X bio / OpenSea / GitHub website field to aurasymbol.com
- [ ] Post a short public update: “Company site live at aurasymbol.com”

## Rollback

Remove the custom domain in Pages, or point DNS back to the previous target. The repository remains the source of truth.
