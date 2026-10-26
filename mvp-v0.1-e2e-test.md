# AURA MVP v0.1 — E2E Test Runbook

Status: **Prepared / Not yet executed**

This runbook defines the first real end-to-end validation for the AURA MVP loop:

**Connect → Establish Identity → Verify NFT → Show AURA Profile**

The purpose is to test the actual product path without inventing usage, ownership, or deployment claims.

## 1. Scope

### In scope

- Node.js application startup
- PostgreSQL connectivity and schema
- AURA API health/status endpoints
- Injected EVM wallet connection
- Wallet-linked Identity challenge and `personal_sign`
- Identity persistence and returning-wallet lookup
- Read-only Ethereum NFT verification
- AURA #001 — ORIGIN verification
- AURA #002 — FORCE verification
- Account/network change handling
- Disconnect behavior
- Expected unavailable states when DB or RPC is not configured

### Out of scope

- Token deployment
- Smart-contract deployment
- NFT transfers or approvals
- Production authentication/session management
- Production-rate limiting
- Production challenge storage
- Investment/fundraising transactions

## 2. Prerequisites

Install or have access to:

1. Node.js with npm
2. PostgreSQL
3. An injected EVM wallet such as MetaMask
4. An Ethereum RPC endpoint for mainnet read access
5. A browser with the wallet extension enabled
6. A test wallet for local verification

Do **not** use or commit private keys, seed phrases, or wallet credentials.

## 3. Environment setup

From the repository root:

```bash
cp .env.example .env
```

Set values in `.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/aura
ETHEREUM_RPC_URL=https://YOUR_ETHEREUM_RPC_ENDPOINT
PORT=3000
```

The real `.env` file must remain local and must never be committed.

## 4. Database setup

Create a PostgreSQL database named `aura` (or use the database name supplied in `DATABASE_URL`).

Apply the initial schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Expected result: the tables `users`, `identities`, `wallets`, `nft_assets`, and `participation` exist.

The schema uses PostgreSQL `pgcrypto` for UUID generation. It does not store private keys or wallet credentials.

## 5. Install and start

```bash
npm install
npm start
```

Expected startup message:

```text
AURA server running at http://localhost:3000
```

Open:

```text
http://localhost:3000
```

## 6. API smoke checks

### Health

Open:

```text
http://localhost:3000/api/health
```

Expected:

- `ok: true`
- database status reflects the local configuration
- Ethereum status reflects the RPC configuration

### Status

Open:

```text
http://localhost:3000/api/status
```

Expected:

- `project: AURA`
- `stage: Early Stage`
- `message: AURA is being built.`
- smart contracts remain `not deployed`

### NFT catalog

Open:

```text
http://localhost:3000/api/nfts
```

Expected catalog entries:

- AURA #001 — ORIGIN
- AURA #002 — FORCE

The endpoint is a catalog endpoint and must not be interpreted as live holder, market, or transaction statistics.

## 7. Browser E2E test — wallet connection

1. Open the AURA portal.
2. Confirm the Connect Wallet control is visible.
3. Click **Connect Wallet**.
4. Approve the wallet connection in the wallet extension.
5. Confirm the connected address is shown in truncated form.
6. Confirm the active chain ID is shown.

Expected:

- No private key is requested.
- No transaction approval is requested.
- The wallet address is read from the injected provider.

## 8. Browser E2E test — establish Identity

With the wallet connected:

1. Start the Identity flow.
2. The browser requests `/api/identity/challenge?address=<wallet>`.
3. Confirm the returned message clearly states that signing does not authorize a transaction or grant access to funds.
4. Approve the `personal_sign` request in the wallet.
5. The browser posts the signature to `/api/identity`.
6. Confirm the UI reports Identity as established.
7. Reload the page.
8. Confirm the existing Identity is found for the same wallet.

Expected API result for creation:

```json
{
  "status": "established",
  "identity": {
    "onChain": false
  }
}
```

Expected security behavior:

- Signature verification must recover the connected wallet address.
- No blockchain transaction is created.
- `onChain` remains `false`.
- The challenge is single-use after successful establishment.

## 9. Browser E2E test — NFT verification

With an Ethereum mainnet wallet connected:

1. Open the NFT verification section.
2. Request verification for the connected address.
3. Confirm the UI displays verification status from the read-only API.
4. Confirm ORIGIN and FORCE are represented by their token IDs.

The API endpoint is:

```text
GET /api/nfts/verify?address=<wallet>
```

Expected response characteristics:

- `status: verified`
- `source: Ethereum mainnet`
- `readOnly: true`
- Each catalog NFT has an on-chain `balance` and boolean `owned` result.

Important: a wallet with zero balance is a valid verification result. It must not be presented as an error.

## 10. Account and network changes

### Account change

1. Connect wallet A.
2. Switch to wallet B in the wallet extension.
3. Confirm the AURA UI clears or refreshes wallet-dependent Identity state.
4. Verify the new address is shown.
5. Run the Identity lookup again.

Expected: Identity data from wallet A must not be shown as belonging to wallet B.

### Network change

1. Connect to Ethereum mainnet.
2. Change the wallet to another EVM network.
3. Confirm the UI refreshes wallet/network-dependent state.
4. NFT verification should not falsely report Ethereum mainnet verification while the provider is on another network.

The backend currently targets Ethereum mainnet for NFT verification.

## 11. Disconnect test

1. Use the AURA disconnect control.
2. Confirm the wallet address is no longer displayed as connected.
3. Reload the page.
4. Confirm the application does not claim that a wallet is connected.

Disconnect is a local UI/provider-state action; it must not imply that a blockchain transaction occurred.

## 12. Failure-state tests

### Database unavailable

Temporarily remove or invalidate `DATABASE_URL`, restart the server, and verify:

- `/api/health` reports the database as unavailable/not configured.
- Identity challenge returns HTTP `503`.
- The UI does not claim that Identity was established.

Restore the database configuration afterward.

### Ethereum RPC unavailable

Temporarily remove or invalidate `ETHEREUM_RPC_URL`, restart the server, and verify:

- `/api/health` reports Ethereum as unavailable/not configured.
- NFT verification returns a clear unavailable/not-configured state.
- The UI does not claim live on-chain verification.

Restore the RPC configuration afterward.

### Wrong network

Use an RPC endpoint/provider that is not Ethereum mainnet or change the wallet network during verification.

Expected backend behavior:

- HTTP `503`
- `status: wrong-network`
- clear statement that AURA NFT verification currently targets Ethereum mainnet

## 13. Security checks

Confirm all of the following:

- No private key appears in source code.
- No seed phrase is requested.
- No wallet credential is stored by AURA.
- Identity uses a signed message, not a transaction.
- Identity creation reports `onChain: false`.
- NFT verification uses read-only contract calls.
- The test never asks the user to approve an NFT transfer or token transfer.
- Real RPC/API credentials remain outside GitHub.

## 14. Evidence to record

After execution, record only observed results:

| Check | Result | Evidence |
|---|---|---|
| Server starts | Pending | terminal output |
| `/api/health` | Pending | JSON response |
| `/api/status` | Pending | JSON response |
| Database schema | Pending | PostgreSQL output |
| Wallet connection | Pending | browser observation |
| Identity challenge | Pending | browser/API response |
| Identity establishment | Pending | browser/API response |
| Returning Identity lookup | Pending | browser/API response |
| NFT verification | Pending | browser/API response |
| Account change | Pending | browser observation |
| Network change | Pending | browser observation |
| Disconnect | Pending | browser observation |
| DB failure state | Pending | API/UI observation |
| RPC failure state | Pending | API/UI observation |
| Security checks | Pending | source/runtime review |

Do not replace `Pending` with `Passed` until the test is actually executed.

## 15. Current limitations

This is the first MVP E2E runbook, not a production-readiness certification.

Known limitations include:

- Identity challenges are currently held in server memory and are not production-grade distributed challenge storage.
- Production rate limiting is not yet implemented.
- A local PostgreSQL/browser E2E run has not yet been executed in this development environment.
- Live Ethereum RPC verification has not yet been executed in this development environment.
- The core AURA platform is not deployed.
- Smart contracts and the token/economic layer are not deployed.

## 16. Completion criteria for MVP v0.1

MVP v0.1 can be marked as E2E-validated only after a real browser/database/RPC run demonstrates:

1. Wallet connection works.
2. Identity challenge is issued and signed.
3. Signature verification establishes the Identity record.
4. Reloaded wallet can retrieve its existing Identity.
5. NFT verification reads Ethereum mainnet ERC-1155 balances.
6. ORIGIN and FORCE verification results are displayed without fabricated data.
7. Account/network changes do not leak stale wallet state.
8. Failure states are clear and honest.
9. No private keys or transaction approvals are involved in the MVP flow.

**Current status: NOT EXECUTED.**
