# AURA Database Foundation

PostgreSQL is the initial database candidate. The application can still run without a database configured.

## Local setup

1. Install PostgreSQL.
2. Create an empty database named `aura`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL`.
4. Run `db/schema.sql` against the database.
5. Run `npm install` and `npm start`.

Without `DATABASE_URL`, `/api/health` reports `database.status = not configured` and the website remains usable.

## Data boundary

On-chain facts such as ownership, transactions, and contracts remain conceptually separate from off-chain application data. Private keys and wallet credentials are never stored.

## Initial entities

- `users` — minimal account record
- `identities` — one AURA identity per user in the initial model
- `wallets` — public wallet address and chain reference only
- `nft_assets` — NFT asset/contract references
- `participation` — future investor, builder, partner, or community participation
