# AURA Web

**AURA — an early-stage Web3 project building toward a connected digital identity, asset, participation and community layer.**

> **We have started. We are building. The next stage is open to people who want to help shape it.**

AURA is not presented as a finished platform. The project has an established identity, tangible on-chain assets, a public portal, documented architecture, and an emerging engineering foundation. The larger product is still being designed and built.

## Project at a glance

| Area | Current state |
|---|---|
| AURA identity / brand | **Established** |
| Symbolic NFT foundation | **Established** |
| AURA #001 — ORIGIN | **On-chain** |
| AURA #002 — FORCE | **On-chain** |
| Public investor / developer portal | **Building** |
| Technical architecture | **Defined / evolving** |
| Backend / API foundation | **Building** |
| NFT catalog API | **Building** |
| Ethereum integration | **Building** |
| Identity architecture | **Design** |
| Production database | **Planned** |
| Core AURA platform | **Not deployed** |
| Token / economic layer | **Conditional** |

## Project history

The GitHub repository is the public engineering hub, not a claim that the AURA idea began on the day the repository was created.

AURA's development can be understood as five layers:

**Concept → Identity → On-chain foundation → Public presence → Engineering build**

The project history documents this progression without inventing dates, traction, funding, users, or other unverifiable claims.

See [`docs/project-history.md`](docs/project-history.md) for the full project history.

## Milestones

The project is deliberately divided into verifiable stages:

- **Foundation** — identity, symbolic assets and public presence
- **Engineering** — backend, data model, API and Web3 foundation
- **Product / Web3** — identity, wallet and on-chain integration
- **Ecosystem** — community, participation and broader platform development
- **Economic layer** — conditional on product utility, evidence and appropriate review

See [`docs/milestones.md`](docs/milestones.md) for the current milestone framework.

## What exists today

- AURA brand and project identity
- AURA #001 — ORIGIN on Ethereum
- AURA #002 — FORCE on Ethereum
- Public investor / developer portal
- Node.js / Express application foundation
- Public API health/status endpoints
- NFT catalog API
- Initial database schema direction
- Ethereum RPC integration foundation
- Technical architecture and roadmap documentation

## What is intentionally not claimed

AURA does **not** present invented or unverified:

- User or holder counts
- Trading volume or floor price
- Revenue
- Investors or funding
- Token supply or token price
- Community size
- Transaction statistics
- Future returns
- Production deployments that do not yet exist

If a number or claim cannot be verified, it is left out.

## Verified on-chain assets

- **AURA #001 — ORIGIN** — Ethereum / ERC-1155
  - https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/1
- **AURA #002 — FORCE** — Ethereum / ERC-1155
  - https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/2

Project account:

- X: https://x.com/AURASymbol

## V3.4 public experience

The V3.4 development branch adds dedicated public pages for the product direction, developer onboarding and live system status:

- `/product.html` — current NFT foundation and future product layers
- `/developer-guide.html` — local setup, stack, API surface and contribution guidance
- `/status.html` — live readout from the public health endpoint
- `docs/v3.4-release-checklist.md` — local verification and production-readiness checklist

The main site also uses a shared responsive design layer, improved navigation and baseline HTTP hardening. These changes remain subject to local browser testing and CI validation before any production release.

## Build in public

This repository is intentionally transparent about what exists, what is being built, and what remains uncertain.

Useful starting points:

- [`docs/project-overview.md`](docs/project-overview.md) — concise public project overview
- [`docs/developer-opportunities.md`](docs/developer-opportunities.md) — practical early contribution areas
- [`docs/technical-review-checklist.md`](docs/technical-review-checklist.md) — independent technical review checklist
- [`docs/investor-one-page.md`](docs/investor-one-page.md) — concise investor and partner brief
- [`docs/project-history.md`](docs/project-history.md) — how the project evolved
- [`docs/developer-faq.md`](docs/developer-faq.md) — answers for developers and technical reviewers
- [`docs/investor-faq.md`](docs/investor-faq.md) — answers for investors and strategic partners
- [`docs/collaboration-proposal.md`](docs/collaboration-proposal.md) — how to propose an early collaboration
- [`docs/progress-update-template.md`](docs/progress-update-template.md) — template for verifiable public updates
- [`docs/milestones.md`](docs/milestones.md) — completed, current and future stages
- [`docs/roadmap.md`](docs/roadmap.md) — staged product direction
- [`docs/architecture.md`](docs/architecture.md) — technical direction
- [`docs/api.md`](docs/api.md) — current API surface
- [`docs/build-in-public.md`](docs/build-in-public.md) — public development principles
- [`docs/contributing.md`](docs/contributing.md) — how builders can participate

## Why participate early?

### For investors

The opportunity is to support the transition from an established concept and initial on-chain foundation into a working product.

Early participation can help determine:

- Which product direction gets tested first
- Which technical capabilities are built first
- How the AURA ecosystem takes shape
- Which partnerships and resources become possible

### For builders

AURA is intentionally early enough that architecture and product decisions can still be influenced.

The opportunity is not simply to implement a finished specification. It is to help create and improve the specification through real engineering, testing and evidence.

## Roadmap

1. **FOUNDATION / NOW** — identity, initial NFTs, public presence and direction.
2. **BUILD / NEXT** — technical foundation, backend, API and core product flows.
3. **CONNECT / FUTURE** — identity, assets, participation, community and platform.
4. **ECONOMY / CONDITIONAL** — economic design only when product utility justifies it.
5. **ECOSYSTEM / LONG TERM** — broader developer, creator, community and partnership ecosystem.

**Build in stages. Prove. Learn. Expand.**

## Run locally — no private configuration required

The public-facing AURA site is designed to start **without a `.env` file, PostgreSQL database, or private API key**. Database and live Ethereum RPC features are optional enhancements.

```bash
git clone https://github.com/AURASymbols/aura-web.git
cd aura-web
npm install
npm start
```

Then open `http://localhost:3000`.

Run the automated smoke tests and JavaScript syntax checks with:

```bash
npm test
npm run check
```

The V3.4 branch also adds these public pages:

- `/product.html` — product direction and current evidence
- `/developer-guide.html` — local setup, stack, API surface and contribution guidance
- `/status.html` — live readout from `GET /api/health`

See [the V3.4 release checklist](docs/v3.4-release-checklist.md) before any production release.

### Optional developer configuration

If you want database-backed or live Ethereum RPC features, copy `.env.example` to `.env` and add your own credentials. **Do not commit `.env` or real secrets to GitHub.**

The repository intentionally keeps private infrastructure optional so developers and reviewers can inspect and run the public foundation first.

## Participation

- **Investor:** provide resources for the next build stage.
- **Builder:** help shape architecture and implementation.
- **Partner:** contribute expertise, access, introductions or meaningful collaboration.

AURA is early. That is explicit. The foundation is real. The next stage is where meaningful participation can make a difference.
