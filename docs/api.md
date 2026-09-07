# AURA API

The AURA API is an early backend layer for the project. It currently exposes service health, project status, the NFT catalog, read-only Ethereum NFT verification, and the early AURA Identity flow.

## Endpoints

### GET /api/health

Returns service health and database configuration/connection status.

The endpoint can run without a configured database.

### GET /api/status

Returns the current high-level AURA system status.

### GET /api/nfts

Returns the current AURA NFT catalog.

Current records:

- AURA #001 — ORIGIN
- AURA #002 — FORCE

The catalog is based on verified project records. It does **not** claim live holder counts, ownership, floor price, volume, or transaction statistics.

### GET /api/nfts/:tokenId

Returns one NFT catalog record by token ID.

Examples:

- `/api/nfts/1`
- `/api/nfts/2`

An unknown token ID returns HTTP 404.

### GET /api/nfts/verify?address=<EVM_ADDRESS>

Performs a **read-only** Ethereum mainnet ownership check for the AURA ERC-1155 NFT records.

The endpoint calls `balanceOf(address, tokenId)` for each AURA NFT in the catalog. It does not request a wallet signature, transaction approval, or private key.

Possible service states include:

- `verified` — live Ethereum RPC verification completed.
- `not-configured` — `ETHEREUM_RPC_URL` is not configured.
- `wrong-network` — the configured RPC is not Ethereum mainnet.
- `unavailable` — the RPC or contract read could not be completed.

The current UI uses this endpoint to show ORIGIN/FORCE ownership and feed the AURA Profile MVP.

### GET /api/identity/challenge?address=<EVM_ADDRESS>

Creates a short-lived wallet-ownership challenge for AURA Identity establishment.

### GET /api/identity?address=<EVM_ADDRESS>

Returns an existing wallet-linked AURA Identity record when one exists.

### POST /api/identity

Verifies a wallet signature against the issued challenge and establishes the wallet-linked AURA Identity record in PostgreSQL.

Identity is currently an **application record**, not an on-chain identity. No private keys or wallet credentials are stored.

## MVP product flow

```text
Connect Wallet
      ↓
Establish AURA Identity
      ↓
Verify AURA NFT ownership
      ↓
Show AURA Profile
```

The profile is deliberately read-only in this stage. It combines the connected wallet, application identity state, and live NFT verification when the required services are configured.

## Architecture boundary

The NFT catalog remains separate from the Web3 integration layer. The verification route uses the Ethereum provider to read blockchain state without putting RPC/provider logic into the catalog data module.

No private keys or wallet credentials are stored by this API.

## Current limitations

- Ethereum RPC configuration is required for live NFT verification.
- NFT verification currently targets Ethereum mainnet only.
- Identity challenges are stored in server memory and are therefore development-stage infrastructure; production should use durable/shared challenge storage and rate limiting.
- The MVP does not deploy or operate a new AURA token or smart contract.
