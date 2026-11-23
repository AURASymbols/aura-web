# AURA Developer FAQ

This FAQ is for engineers, technical reviewers and product builders evaluating an early-stage project. It describes the current direction, not a promise that planned systems are already deployed.

## 1. What is AURA building?

AURA is exploring a Web3 product ecosystem connecting digital identity, NFTs and other digital assets, participation and community. The near-term product direction is a small AURA Identity / Profile experience.

## 2. Why Ethereum?

The first AURA assets are published on Ethereum as ERC-1155 assets. Ethereum provides an existing public standard and independently verifiable on-chain records for this initial layer. Future chain decisions should be based on product requirements, user experience, cost, security and ecosystem fit—not assumed in advance.

## 3. What is the current stack?

The current repository includes a lightweight frontend using HTML, CSS and browser JavaScript, with a Node.js / Express backend foundation. The project also includes an Ethereum integration foundation using ethers and optional PostgreSQL support. See [package.json](../package.json) and [Technical Architecture](architecture.md).

## 4. What is already working?

The repository contains the public web portal and an application foundation with documented health/status and NFT-related API routes. Exact runtime availability depends on the deployment and its configuration. Review the source and run the project locally rather than assuming every optional service is live.

## 5. What is not complete?

The full production platform, complete identity architecture, production database deployment, additional smart contracts and any token system are not established as completed deliverables. The [milestones](milestones.md) document is the status reference.

## 6. What is the first product target?

The current MVP direction is:

`Connect → Establish Identity → Verify NFT → Show AURA Profile`

The goal is to validate one coherent user flow before adding more ecosystem layers.

## 7. How can I contribute?

Useful early contributions include:

- Review the current architecture and identify unnecessary complexity.
- Propose a clear data model and API boundaries.
- Improve test coverage, error handling and security.
- Review wallet connection and read-only NFT verification flows.
- Improve accessibility, responsive design and user experience.
- Break roadmap goals into small, testable issues.

Read [Contributing to AURA](contributing.md) before proposing implementation work.

## 8. How are contributions reviewed?

Please begin with a GitHub Issue describing the problem, proposed change, expected behavior and any security or compatibility impact. For larger changes, discuss the design before opening a pull request. Keep changes focused and include tests or reproducible verification steps where practical.

## 9. Are paid roles or grants available?

No standing salary, grant, equity or token compensation program is being represented in this repository. If a specific paid engagement becomes available, its scope, payment terms, intellectual-property ownership and legal arrangements must be agreed in writing before work begins. Do not assume future token allocation or speculative rewards.

## 10. Is there a token or smart-contract bounty?

No token sale, token allocation, or smart-contract bounty is currently being offered. Additional contract work should follow a defined product requirement, threat model, independent review and deployment plan.

## 11. How do I contact the project?

Start with the public [GitHub repository](https://github.com/AURASymbols/aura-web) and [AURA X account](https://x.com/AURASymbol). Do not send private keys, seed phrases, passwords or sensitive personal information.

## 12. What should I include in a first message?

- Your technical or product background.
- The part of AURA you reviewed.
- One concrete observation or improvement proposal.
- Your availability and preferred collaboration model.
- Links to relevant public work, if applicable.
