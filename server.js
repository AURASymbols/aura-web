const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const startedAt = Date.now();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Basic service health check.
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "aura-web",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000)
  });
});

// Public project status. Keep this factual; do not expose secrets here.
app.get("/api/status", (req, res) => {
  res.json({
    project: "AURA",
    version: "1.7.0",
    stage: "Early Stage",
    message: "AURA is being built.",
    systems: {
      website: "building",
      backend: "building",
      database: "not deployed",
      web3: "research",
      smartContracts: "not deployed"
    },
    social: {
      x: "https://x.com/AURASymbol"
    },
    nft: {
      origin: "AURA #001 — ORIGIN",
      force: "AURA #002 — FORCE"
    }
  });
});

// API 404s return JSON; normal site routes continue to the SPA entry point.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Final error handler for unexpected server errors.
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`AURA server running at http://localhost:${PORT}`);
});
