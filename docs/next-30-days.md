# AURA — Next 30 days (project lead plan)

Domain status: **aurasymbol.com live** (Cloudflare Worker `aura-web`).  
Website status: **company site deployed**; email routing (`ceo@`) next to stabilize.

## Business objective

Turn AURA from “repo + NFTs + docs” into a **public company presence** people can evaluate, then start the first product proof loop.

## Week 1 — Presence

1. Deploy company site (Cloudflare Pages → `public`)
2. Connect `aurasymbol.com` (see [go-live-aurasymbol.md](go-live-aurasymbol.md))
3. Point social / GitHub / OpenSea links to the domain
4. Publish a short build-in-public update (no invented metrics)

**Exit criteria:** `https://aurasymbol.com` loads the company site over HTTPS.

## Week 2 — Conversations

1. Investor one-pager review against the live site
2. Builder outreach via GitHub + X with a clear ask
3. Contact path tested end-to-end (form → X DM)
4. Collect serious inbound in a simple tracker (spreadsheet is enough)

**Exit criteria:** At least a working outreach loop; no vanity follower goals.

## Week 3–4 — Product proof (MVP v0.1)

Priority product loop:

`Connect wallet → Establish identity → Verify ORIGIN/FORCE → Show AURA profile`

1. Decide hosting for `/api` (Node host) if status/identity need to be live
2. Configure optional `ETHEREUM_RPC_URL` for verification
3. Ship a minimal profile UI behind the company nav
4. Run the documented e2e checklist in `mvp-v0.1-e2e-test.md`

**Exit criteria:** One recorded walkthrough of the loop on a real wallet (test or mainnet read-only).

## Explicitly not this month

- Token contract / supply / sale
- Fundraising page that implies an offer
- Fake stats, floors, or community size claims
- Full platform rebuild

## Decision log (update as we go)

| Date | Decision | Why |
|---|---|---|
| 2026-11-24 | Ship company site before token/economy | Evidence and presence first |
| 2026-11-24 | Domain cutover can be static-first | Unblock aurasymbol.com without waiting on API host |
| 2026-11-24 | Next product bet = MVP identity loop | Smallest verifiable product proof |

## Owner

Project lead owns domain cutover, public messaging, and MVP scope. Engineering follows the Week 3–4 loop once the domain is live.
