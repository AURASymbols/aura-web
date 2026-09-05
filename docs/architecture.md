# AURA Technical Architecture — Early Direction

This document describes the current technical direction. It is a working design, not a final specification.

## Current state

AURA currently has a functioning static web portal served by a small Node.js / Express application. The NFT layer includes two published ERC-1155 assets on Ethereum.

The production backend, database, API platform, full identity architecture, and additional smart contracts are not yet deployed.

## Target architecture

```text
User / Browser
      |
      v
AURA Web Platform
      |
      +--------------------+
      |                    |
      v                    v
   Backend/API          Web3 Layer
      |                    |
      v                    v
   Database          Blockchain / NFTs
      |
      v
Identity / Participation / Community
```

## Frontend

Current foundation:

- HTML
- CSS
- Vanilla JavaScript
- Responsive single-deployment portal
- Hash-based sections for Home, Investors, Developers, Proof, NFT, Token, Roadmap and Contact

The frontend is intentionally lightweight at this stage so product assumptions can change without creating unnecessary technical debt.

## Backend

Current foundation:

- Node.js
- Express 5
- `/api/status` endpoint
- Static asset serving

Planned exploration:

- API structure
- Authentication / account model
- Identity data model
- Database integration
- Contact / communication service
- Observability and production deployment

**Status: TO BE BUILT**

## Database

The production database has not been selected or deployed.

Areas likely to require persistence include:

- User / identity records
- AURA asset relationships
- Community participation
- Product configuration
- Activity and platform data

**Status: TO BE DETERMINED**

## Web3 layer

The existing NFT assets are on Ethereum and can be independently verified through OpenSea.

Future work may include:

- Wallet connection
- On-chain asset reads
- NFT ownership / metadata integration
- Smart contract integration where justified

Additional smart contracts are not currently deployed.

## Identity architecture

Digital identity is a core AURA concept, but the complete identity architecture is still being designed.

Questions to resolve before implementation include:

- What constitutes an AURA identity?
- Which identity data belongs on-chain vs. off-chain?
- How should wallets and accounts relate?
- What should be portable between applications?
- How should privacy and user control be handled?

**Status: IN DESIGN**

## Economic layer

The token/economic layer remains conditional.

No token contract, supply, sale, or economic promise is established. Any future design must follow real product utility and appropriate legal / regulatory review.

## Engineering principle

AURA should not build infrastructure merely because it is technically possible. Each technical layer should support a demonstrated product need.

**Build the smallest useful foundation. Prove it. Then expand.**
