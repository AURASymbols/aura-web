const express = require("express");
const fs = require("fs");
const path = require("path");
const { getDatabaseStatus, initializeDatabase, closeDatabase } = require("./server/db");
const { getEthereumStatus, getEthBalance } = require("./server/web3/ethereum");
const nftRoutes = require("./server/routes/nfts");
const nftVerificationRoutes = require("./server/routes/nft-verification");
const identityRoutes = require("./server/routes/identity");

const app = express();
const PORT = process.env.PORT || 3000;
const startedAt = Date.now();
const publicDir = path.join(__dirname, "public");

app.use(express.json());
app.use(express.static(publicDir, { index: false }));

app.get(["/", "/index.html"], (req, res, next) => {
  fs.readFile(path.join(publicDir, "index.html"), "utf8", (error, html) => {
    if (error) return next(error);

    const scripts = [
      '<script src="/wallet-balance.js"></script>',
      '<script src="/site-polish.js?v=4.1"></script>',
      '<script src="/contact-flow.js"></script>',
      '<script src="/proof-mvp.js"></script>'
    ];
    const page = scripts.reduce((current, script) => {
      const src = script.match(/src="([^"]+)"/)?.[1];
      return src && current.includes(src) ? current : current.replace("</body>", `${script}</body>`);
    }, html);

    const styles = [
      '<link rel="stylesheet" href="/layout-fix.css">',
      '<link rel="stylesheet" href="/hero-refinement.css">',
      '<link rel="stylesheet" href="/proof-refinement.css">'
    ];
    const styledPage = styles.reduce((current, style) => {
      const href = style.match(/href="([^"]+)"/)?.[1];
      return href && current.includes(href) ? current : current.replace("</head>", `${style}</head>`);
    }, page);

    res.type("html").send(styledPage);
  });
});

app.get("/api/health", async (req, res) => {
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

app.get("/api/wallet/:address", async (req, res) => {
  const { address } = req.params;
  const balance = await getEthBalance(address);

  if (balance.status === "not-configured") {
    return res.status(503).json(balance);
  }

  if (balance.status === "unavailable") {
    return res.status(503).json(balance);
  }

  res.json(balance);
});

app.get("/api/status", async (req, res) => {
  const [database, ethereum] = await Promise.all([
    getDatabaseStatus(),
    getEthereumStatus()
  ]);

  res.json({
    project: "AURA",
    version: "1.9.1",
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

app.use((req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
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
      console.log(`Received ${signal}. Shutting down...\`);
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
