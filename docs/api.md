# AURA API

The AURA API is an early backend layer for the project. It currently exposes service health, project status, and the verified NFT catalog.

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

## Architecture boundary

The NFT catalog is intentionally separate from the future Web3 integration layer. Later, a Web3 adapter can read blockchain state and enrich or validate these records without mixing RPC/provider logic into the application routes.

No private keys or wallet credentials are stored by this API.
