const express = require("express");
const crypto = require("crypto");
const { getDatabase, isDatabaseConfigured } = require("../db");
const { ethers } = require("ethers");

const router = express.Router();
const challenges = new Map();
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

function normalizeAddress(address) {
  if (!address || typeof address !== "string") return null;
  try {
    return ethers.getAddress(address);
  } catch {
    return null;
  }
}

function chainName(chainId) {
  const normalized = String(chainId || "").toLowerCase();
  const known = {
    "0x1": "ethereum",
    "0xaa36a7": "ethereum-sepolia"
  };
  return known[normalized] || `eip155:${parseInt(normalized, 16) || 0}`;
}

function challengeMessage(address, nonce) {
  return [
    "AURA Identity Verification",
    "",
    "Sign this message to establish your AURA identity association.",
    "This does not authorize a transaction and does not give AURA access to your funds.",
    "",
    `Wallet: ${address}`,
    `Nonce: ${nonce}`
  ].join("\n");
}

router.get("/challenge", (req, res) => {
  if (!isDatabaseConfigured()) {
    return res.status(503).json({ error: "Identity service is not configured. DATABASE_URL is required." });
  }

  const address = normalizeAddress(req.query.address);
  if (!address) return res.status(400).json({ error: "A valid EVM wallet address is required." });

  const nonce = crypto.randomBytes(16).toString("hex");
  const message = challengeMessage(address, nonce);
  challenges.set(address.toLowerCase(), { message, expiresAt: Date.now() + CHALLENGE_TTL_MS });

  res.json({ address, message, expiresInSeconds: CHALLENGE_TTL_MS / 1000 });
});

router.get("/", async (req, res) => {
  if (!isDatabaseConfigured()) {
    return res.status(503).json({ error: "Identity service is not configured. DATABASE_URL is required." });
  }

  const address = normalizeAddress(req.query.address);
  if (!address) return res.status(400).json({ error: "A valid EVM wallet address is required." });

  try {
    const db = await getDatabase();
    const result = await db.query(
      `SELECT i.id, i.display_name, i.created_at, w.address, w.chain
       FROM identities i
       JOIN users u ON u.id = i.user_id
       JOIN wallets w ON w.user_id = u.id
       WHERE LOWER(w.address) = LOWER($1)
       ORDER BY i.created_at ASC
       LIMIT 1`,
      [address]
    );

    if (!result.rows[0]) return res.status(404).json({ identity: null });
    res.json({ identity: { ...result.rows[0], onChain: false }, status: "established" });
  } catch (error) {
    console.error("Identity lookup failed:", error);
    res.status(500).json({ error: "Identity lookup failed." });
  }
});

router.post("/", async (req, res) => {
  if (!isDatabaseConfigured()) {
    return res.status(503).json({ error: "Identity service is not configured. DATABASE_URL is required." });
  }

  const address = normalizeAddress(req.body?.address);
  const chainId = req.body?.chainId;
  const signature = req.body?.signature;
  const displayName = typeof req.body?.displayName === "string" ? req.body.displayName.trim().slice(0, 80) : null;

  if (!address || !chainId || !signature) {
    return res.status(400).json({ error: "address, chainId and signature are required." });
  }

  const challenge = challenges.get(address.toLowerCase());
  if (!challenge || challenge.expiresAt < Date.now()) {
    challenges.delete(address.toLowerCase());
    return res.status(400).json({ error: "Identity verification challenge is missing or expired. Request a new challenge." });
  }

  try {
    const recovered = ethers.verifyMessage(challenge.message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: "Wallet signature does not match the connected address." });
    }

    const pool = await getDatabase();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existingWallet = await client.query(
        `SELECT user_id FROM wallets WHERE LOWER(address) = LOWER($1) ORDER BY created_at ASC LIMIT 1`,
        [address]
      );

      let userId = existingWallet.rows[0]?.user_id;
      if (!userId) {
        const createdUser = await client.query(`INSERT INTO users (id) VALUES (gen_random_uuid()) RETURNING id`);
        userId = createdUser.rows[0].id;
      }

      await client.query(
        `INSERT INTO wallets (id, user_id, address, chain)
         VALUES (gen_random_uuid(), $1, $2, $3)
         ON CONFLICT (address, chain) DO NOTHING`,
        [userId, address, chainName(chainId)]
      );

      const identityResult = await client.query(
        `INSERT INTO identities (id, user_id, display_name)
         VALUES (gen_random_uuid(), $1, $2)
         ON CONFLICT (user_id) DO UPDATE SET display_name = COALESCE(EXCLUDED.display_name, identities.display_name)
         RETURNING id, display_name, created_at`,
        [userId, displayName]
      );

      await client.query("COMMIT");
      challenges.delete(address.toLowerCase());

      res.status(201).json({
        status: "established",
        identity: {
          ...identityResult.rows[0],
          address,
          chain: chainName(chainId),
          onChain: false
        }
      });
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Identity creation failed:", error);
    res.status(500).json({ error: "Identity creation failed." });
  }
});

module.exports = router;
