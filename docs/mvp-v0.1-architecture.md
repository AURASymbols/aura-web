# AURA MVP v0.1 — Product Architecture

## Purpose

This document defines the first end-to-end AURA product loop. It is intentionally small: the goal is to create a real, testable product that produces evidence for the next business and engineering decisions.

## Product Loop

**Connect → Establish Identity → Verify NFT → Show AURA Profile**

```text
User
  ↓
AURA Portal
  ↓
Connect Wallet
  ↓
AURA API
  ├──────────────→ Identity / Database
  │
  └──────────────→ Web3 Read Layer
                         ↓
                    Ethereum / NFTs
                         ↓
                    AURA Profile
```

## 1. Entry — AURA Portal

### User experience
The user arrives at the AURA portal and immediately understands:

- what AURA is
- that the project is early-stage
- what can be done today
- how to participate

Primary action: **Connect Wallet**.

### Business value
Creates a real entry point instead of relying only on social posts or static project descriptions.

### Growth value
The portal becomes the destination linked from X, Facebook, Discord, investor outreach, and developer outreach.

---

## 2. Wallet Connection

### User experience
The user connects an EVM-compatible wallet such as MetaMask.

The MVP should initially request only what is necessary to identify the connected public wallet address.

### Technical boundary
Browser wallet → application wallet state → AURA API.

No private keys are collected or stored by AURA.

### Business value
Tests whether users are willing to enter AURA through a Web3-native identity mechanism.

### Growth value
A working wallet connection is a concrete product capability that can be demonstrated publicly.

---

## 3. AURA Identity

### User experience
After connecting, the user can create or access a minimal AURA Identity associated with the connected wallet.

The MVP should keep the identity model intentionally small and avoid premature social features.

### Initial concept

```text
AURA Identity
├── Identity ID
├── Wallet reference
├── Created / updated timestamps
└── Verified AURA assets
```

### Business value
Begins testing AURA's central identity concept and creates the foundation for future identity-based services.

### Growth value
Gives users something more meaningful than simply holding an NFT: a visible relationship with the AURA ecosystem.

---

## 4. NFT Verification

### User experience
AURA checks the connected wallet against the existing AURA on-chain NFT assets.

Initial targets:

- **AURA #001 — ORIGIN**
- **AURA #002 — FORCE**

The interface should distinguish verified blockchain information from application-generated information.

### Technical boundary

```text
Wallet address
      ↓
Web3 read layer
      ↓
Ethereum
      ↓
NFT ownership / asset data
      ↓
AURA API
```

### Business value
Connects the new product experience to assets that already exist on-chain.

### Growth value
Creates a demonstrable link between AURA's public NFT presence and the emerging platform.

---

## 5. AURA Profile

### User experience
The user sees one simple profile combining:

- AURA Identity
- connected wallet reference
- verified AURA NFTs
- basic profile status

Example:

```text
AURA PROFILE

Identity
AURA-XXXX

Wallet
0x....

Verified AURA Assets
#001 ORIGIN
#002 FORCE
```

### Business value
This is the first visible product output. It allows AURA to test whether identity + verified assets form a useful experience.

### Growth value
A profile is easier to demonstrate, share, and discuss than an abstract architecture diagram.

---

## 6. MVP Completion Test

MVP v0.1 is considered functionally complete when a test user can:

1. Open the AURA portal.
2. Connect an EVM wallet.
3. Create or access an AURA Identity.
4. Retrieve verified information for AURA NFT assets.
5. See one AURA Profile containing the identity and verified assets.
6. Disconnect safely.
7. Repeat the flow using documented local/test configuration.

## 7. What We Deliberately Do Not Build Yet

The following are outside MVP v0.1:

- AURA token launch
- token supply, sale, price, or valuation claims
- DAO governance
- large social/community platform
- large NFT marketplace
- production-scale infrastructure
- complex reputation systems
- unnecessary smart-contract deployment
- guaranteed investment or economic outcomes

This protects capital, reduces technical risk, and keeps the first validation focused.

## 8. Architecture Principles

### Evidence before expansion
Every major next layer should follow evidence from the previous layer.

### Read before write
Use read-only blockchain integration before introducing unnecessary transaction complexity.

### Separate on-chain and off-chain data
Blockchain facts should remain distinguishable from application data.

### No private keys
AURA does not need custody of user wallet private keys for MVP v0.1.

### Small enough to test
The MVP must be understandable and testable by a small team.

### Designed for extension
The first architecture should not unnecessarily block future identity, community, economic, or platform layers.

---

## 9. Business + Growth Loop

MVP development and promotion should reinforce each other.

```text
Build feature
    ↓
Test feature
    ↓
Capture evidence
    ↓
Publish progress
    ↓
Attract users / builders / partners
    ↓
Collect feedback
    ↓
Improve product
    ↓
Repeat
```

A technical milestone can therefore become:

- a product capability
- a GitHub development record
- an X/Facebook update
- a developer recruitment signal
- an investor proof point

The objective is not hype. The objective is to make real progress visible.

## 10. Success Signals

MVP v0.1 should produce measurable evidence rather than vanity metrics.

Examples of useful signals:

- successful wallet connections
- completed identity creations
- verified NFT checks
- completed profile flows
- repeat usage
- user feedback
- developer interest
- partner conversations

These signals should be recorded only when actually observed. No numbers should be invented for presentation purposes.

## 11. Next Engineering Breakdown

The architecture should be implemented in this order:

1. Wallet connection UX
2. Wallet/session API boundary
3. Minimal AURA Identity flow
4. Web3 NFT ownership/read verification
5. AURA Profile UI
6. End-to-end test
7. Instrumentation for real usage evidence

Related GitHub issues:

- #1 Backend foundation
- #2 Data model — completed
- #3 Web3 integration layer
- #4 Digital identity architecture
- #5 Database foundation
