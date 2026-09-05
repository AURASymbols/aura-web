const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
  res.json({
    project: "AURA",
    version: "1.6.0",
    stage: "Early Stage",
    message: "AURA is being built.",
    social: { x: "https://x.com/AURASymbol" },
    nft: { origin: "AURA #001 — ORIGIN", force: "AURA #002 — FORCE" }
  });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`AURA server running at http://localhost:${PORT}`));
