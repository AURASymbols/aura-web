const express = require("express");
const { ethers } = require("ethers");
const { getProvider, isConfigured } = require("../web3/ethereum");
const { listNFTs } = require("../data/nfts");

const router = express.Router();

const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)"
];

const VERIFY_RATE_WINDOW_MS = 60 * 1000;
const VERIFY_RATE_LIMIT = 30;
const MAX_TRACKED_RATE_LIMITS = 5000;
const verificationRateLimits = new Map();

function normalizeAddress(address) {
  if (!address || typeof address !== "string") return null;
  try {
    return ethers.getAddress(address);
  } catch {
    return null;
  }
}

function limitVerificationRequests(req, res, next) {
  const now = Date.now();
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  let record = verificationRateLimits.get(ip);

  if (!record || record.resetAt <= now) {
    record = { count: 0, resetAt: now + VERIFY_RATE_WINDOW_MS };
    verificationRateLimits.set(ip, record);
  }

  record.count += 1;

  if (verificationRateLimits.size > MAX_TRACKED_RATE_LIMITS) {
    for (const [trackedIp, tracked] of verificationRateLimits) {
      if (tracked.resetAt <= now || verificationRateLimits.size > MAX_TRACKED_RATE_LIMITS) {
        verificationRateLimits.delete(trackedIp);
      }
      if (verificationRateLimits.size <= MAX_TRACKED_RATE_LIMITS) break;
    }
  }

  if (record.count > VERIFY_RATE_LIMIT) {
    const retryAfter = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({
      status: "rate-limited",
      error: "Too many NFT verification requests. Please try again later."
    });
  }

  next();
}

router.get("/verify", limitVerificationRequests, async (req, res) => {
  const address = normalizeAddress(req.query.address);

  if (!address) {
    return res.status(400).json({
      status: "invalid-request",
      error: "A valid EVM wallet address is required."
    });
  }

  if (!isConfigured()) {
    return res.status(503).json({
      status: "not-configured",
      error: "Ethereum verification is not configured. ETHEREUM_RPC_URL is required.",
      address
    });
  }

  try {
    const provider = getProvider();
    const network = await provider.getNetwork();

    if (network.chainId !== 1n) {
      return res.status(503).json({
        status: "wrong-network",
        error: "AURA NFT verification currently targets Ethereum mainnet.",
        chainId: network.chainId.toString(),
        address
      });
    }

    const results = [];

    for (const nft of listNFTs()) {
      const contract = new ethers.Contract(nft.contractAddress, ERC1155_ABI, provider);
      const balance = await contract.balanceOf(address, nft.tokenId);
      const balanceString = balance.toString();

      results.push({
        tokenId: nft.tokenId,
        name: nft.name,
        collection: nft.collection,
        standard: nft.standard,
        contractAddress: nft.contractAddress,
        balance: balanceString,
        owned: balance > 0n,
        dataStatus: "verified-onchain"
      });
    }

    res.json({
      status: "verified",
      source: "Ethereum mainnet",
      chainId: network.chainId.toString(),
      address,
      readOnly: true,
      nfts: results
    });
  } catch (error) {
    console.error("NFT verification failed:", error.code || error.name || "unknown");
    res.status(503).json({
      status: "unavailable",
      error: "Ethereum NFT verification is currently unavailable.",
      address
    });
  }
});

module.exports = router;
