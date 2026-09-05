const express = require("express");
const path = require("path");
const { getDatabaseStatus, closeDatabase } = require("./server/db");

const app = express();
const PORT = process.env.PORT || 3000;
const startedAt = Date.now();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (req, res) => {
  const database = await getDatabaseStatus();
  res.json({
    ok: true,
    service: "aura-web",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    database
  });
});

app.get("/api/status", async (req, res) => {
  const database = await getDatabaseStatus();
  res.json({
    project: "AURA",
    version: "1.8.0",
    stage: "Early Stage",
    message: "AURA is being built.",
    systems: {
      website: "building",
      backend: "building",
      database: database.configured ? database.status : "not configured",
      web3: "research",
      smartContracts: "not deployed"
    },
    social: { x: "https://x.com/AURASymbol" },
    nft: { origin: "AURA #001 — ORIGIN", force: "AURA #002 — FORCE" }
  });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal server error" });
});

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
