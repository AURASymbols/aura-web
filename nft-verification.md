# AURA NFT Verification

## Status

**Building / Early implementation**

AURA now has a read-only Ethereum verification endpoint for the initial NFT layer.

## Purpose

The verification layer checks whether a connected EVM wallet currently holds either of the two verified AURA ERC-1155 assets:

- AURA #001 — ORIGIN
- AURA #002 — FORCE

The check is performed against Ethereum mainnet through the configured `ETHEREUM_RPC_URL`.

## Endpoint

`GET /api/nfts/verify?address=<wallet-address>`

The endpoint returns:

- normalized wallet address
- Ethereum chain ID
- NFT token ID and name
- ERC-1155 balance
- `owned: true/false`
- `dataStatus: verified-onchain`
- explicit read-only status

## Important boundaries

- No private keys are handled or stored.
- No wallet custody is performed.
- No transaction is requested or submitted.
- OpenSea is not used as the live ownership source.
- The endpoint does not invent ownership when the RPC is unavailable.
- Ethereum mainnet is currently the only verification target.

## Configuration

Set `ETHEREUM_RPC_URL` in the server environment. If it is missing, the endpoint returns `not-configured`. If the RPC is unavailable, it returns `unavailable`.

## MVP role

NFT verification is the third step of the first AURA product loop:

`Connect → Establish Identity → Verify NFT → Show AURA Profile`

The next frontend step is to expose these verified results inside the connected-wallet experience and then feed them into the AURA Profile.

## Testing status

The implementation has been committed to the public repository, but browser end-to-end verification against a live RPC has **not** yet been completed. The project should not claim live wallet ownership results until that test is performed.
