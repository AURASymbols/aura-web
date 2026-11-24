"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "public");
const output = path.join(root, "dist");

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function main() {
  if (!(await exists(path.join(source, "index.html")))) {
    throw new Error("Missing public/index.html; cannot build AURA static site.");
  }

  await fs.rm(output, { recursive: true, force: true });
  await fs.cp(source, output, { recursive: true });

  const indexPath = path.join(output, "index.html");
  let html = await fs.readFile(indexPath, "utf8");

  const styles = [
    "/layout-fix.css",
    "/hero-refinement.css",
    "/proof-refinement.css",
    "/platform-brief.css",
    "/interest-refinement.css",
    "/v3.4.css",
    "/aura-v5.css?v=11"
  ];
  for (const href of styles) {
    const key = href.split("?")[0];
    if (!html.includes(key)) html = html.replace("</head>", `<link rel="stylesheet" href="${href}"></head>`);
  }

  const scripts = [
    "/wallet-balance.js",
    "/site-polish.js?v=4.1",
    "/contact-flow.js",
    "/proof-mvp.js",
    "/v3.4.js",
    "/aura-v5.js?v=8"
  ];
  for (const src of scripts) {
    const key = src.split("?")[0];
    if (!html.includes(key)) {
      const defer = src.includes("aura-v5.js") ? " defer" : "";
      html = html.replace("</body>", `<script src="${src}"${defer}></script></body>`);
    }
  }
  await fs.writeFile(indexPath, html);

  const statusPath = path.join(output, "status.html");
  if (await exists(statusPath)) {
    let status = await fs.readFile(statusPath, "utf8");
    status = status.replace(
      "This page reads the public health endpoint and reports what the server can currently confirm. A green website status does not mean every optional service is configured.",
      "This static website is hosted independently. Backend APIs, database services and live Ethereum RPC are not included in this deployment."
    );
    status = status.replace(/<a href="\\/api\\/health"[^>]*>OPEN HEALTH JSON ↗<\\/a>/, "<a href=\"/product.html\">VIEW PRODUCT</a>");
    status = status.replace("LIVE / AUTO-REFRESH EVERY 60 SECONDS", "STATIC DEPLOYMENT / SERVICE SCOPE");
    status = status.replace("<script src=\"/status.js\" defer></script>", "<script src=\"/static-status.js\" defer></script>");
    await fs.writeFile(statusPath, status);
  }

  console.log("AURA static site built successfully: dist/");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
