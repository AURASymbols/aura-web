const express = require("express");
const fs = require("fs");
const path = require("path");
const { getDatabaseStatus, initializeDatabase, closeDatabase } = require("./server/db");
const { getEthereumStatus, getEthBalance } = require("./server/web3/ethereum");
const nftRoutes = require("./server/routes/nfts");
const nftVerificationRoutes = require("./server/routes/nft-verification");
const identityRoutes = require("./server/routes/identity");

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 3000;
const startedAt = Date.now();
const publicDir = path.join(__dirname, "public");
const apiRateLimits = new Map();
const API_RATE_WINDOW_MS = 60 * 1000;
const API_RATE_MAX = 60;
const API_RATE_MAX_ENTRIES = 5000;

function limitApiRequests(req, res, next) {
  const now = Date.now();
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  const key = `${req.path.split("/").slice(0, 3).join("/")}: ${ip}`;
  let record = apiRateLimits.get(key);

  if (!record || record.resetAt <= now) {
    record = { count: 0, resetAt: now + API_RATE_WINDOW_MS };
    apiRateLimits.set(key, record);
  }
  record.count += 1;

  if (apiRateLimits.size > API_RATE_MAX_ENTRIES) {
    for (const [trackedKey, tracked] of apiRateLimits) {
      if (tracked.resetAt <= now || apiRateLimits.size > API_RATE_MAX_ENTRIES) {
        apiRateLimits.delete(trackedKey);
      }
      if (apiRateLimits.size <= API_RATE_MAX_ENTRIES) break;
    }
  }

  if (record.count > API_RATE_MAX) {
    const retryAfter = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({
      status: "rate-limited",
      error: "Too many API requests. Please try again later."
    });
  }

  next();
}


app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(express.json({ limit: "32kb" }));
app.use(express.static(publicDir, { index: false }));

app.get(["/", "/index.html"], (req, res, next) => {
  fs.readFile(path.join(publicDir, "index.html"), "utf8", (error, html) => {
    if (error) return next(error);

    const scripts = [
      '<script src="/wallet-balance.js"></script>',
      '<script src="/site-polish.js?v=4.1"></script>',
      '<script src="/contact-flow.js"></script>',
      '<script src="/proof-mvp.js"></script>',
      '<script src="/v3.4.js"></script>',
      '<script src="/aura-v5.js?v=8" defer></script>'
    ];
    const page = scripts.reduce((current, script) => {
      const src = script.match(/src="([^"]+)"/)?.[1];
      return src && current.includes(src) ? current : current.replace("</body>", `${script}</body>`);
    }, html);

    const styles = [
      '<link rel="stylesheet" href="/layout-fix.css">',
      '<link rel="stylesheet" href="/hero-refinement.css">',
      '<link rel="stylesheet" href="/proof-refinement.css">',
      '<link rel="stylesheet" href="/platform-brief.css">',
      '<link rel="stylesheet" href="/interest-refinement.css">',
      '<link rel="stylesheet" href="/v3.4.css">',
      '<link rel="stylesheet" href="/aura-v5.css?v=11">'
    ];
    const styledPage = styles.reduce((current, style) => {
      const href = style.match(/href="([^"]+)"/)?.[1];
      return href && current.includes(href) ? current : current.replace("</head>", `${style}</head>`);
    }, page);

    res.type("html").send(styledPage);
  });
});

app.get("/api/health", limitApiRequests, async (req, res) => {
  const [database, ethereum] = await Promise.all([
    getDatabaseStatus(),
    getEthereumStatus()
  ]);

  res.json({
    ok: true,
    service: "aura-web",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    database,
    ethereum
  });
});

app.get("/api/wallet/:address", limitApiRequests, async (req, res) => {
  const { address } = req.params;
  const balance = await getEthBalance(address);

  if (balance.status === "not-configured") return res.status(503).json(balance);
  if (balance.status === "unavailable") return res.status(503).json(balance);
  res.json(balance);
});

app.get("/api/status", limitApiRequests, async (req, res) => {
  const [database, ethereum] = await Promise.all([
    getDatabaseStatus(),
    getEthereumStatus()
  ]);

  res.json({
    project: "AURA",
    version: "3.5.0",
    stage: "Early Stage",
    message: "AURA is being built.",
    systems: {
      website: "building",
      backend: "building",
      database: database.configured ? database.status : "not configured",
      nftApi: "building",
      nftVerification: ethereum.configured ? "building" : "not configured",
      identityApi: database.configured ? "building" : "not configured",
      ethereum: ethereum.configured ? ethereum.status : "not configured",
      web3: "research",
      smartContracts: "additional contracts not deployed"
    },
    social: { x: "https://x.com/AURASymbol" },
    nft: {
      origin: "AURA #001 — ORIGIN",
      force: "AURA #002 — FORCE",
      network: "Ethereum",
      standard: "ERC-1155",
      contract: "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593"
    }
  });
});

app.use("/api/nfts", nftVerificationRoutes);
app.use("/api/nfts", nftRoutes);
app.use("/api/identity", identityRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use((req, res, next) => {
  if (path.extname(req.path)) return res.status(404).sendFile(path.join(publicDir, "404.html"));
  res.sendFile(path.join(publicDir, "index.html"), error => {
    if (error) next(error);
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal server error" });
});

async function startServer() {
  try {
    if (process.env.DATABASE_URL) {
      await initializeDatabase();
      console.log("AURA database schema ready.");
    }

    const server = app.listen(PORT, () => {
      console.log(`AURA server running at http://localhost:${PORT}`);
    });

    async function shutdown(signal) {
      console.log(`Received ${signal}. Shutting down...`);
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("AURA server startup failed:", error);
    await closeDatabase();
    process.exit(1);
  }
}

startServer();
