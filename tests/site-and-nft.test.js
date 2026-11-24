const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { listNFTs, getNFTByTokenId } = require("../server/data/nfts");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("AURA NFT catalog contains the two published ERC-1155 assets", () => {
  const nfts = listNFTs();
  assert.deepEqual(nfts.map((nft) => nft.tokenId), ["1", "2"]);
  assert.equal(new Set(nfts.map((nft) => nft.tokenId)).size, nfts.length);
  for (const nft of nfts) {
    assert.equal(nft.chain, "Ethereum");
    assert.equal(nft.standard, "ERC-1155");
    assert.equal(nft.contractAddress, "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593");
    assert.match(nft.openSeaUrl, /^https:\/\/opensea\.io\/item\/ethereum\//);
  }
});

test("NFT catalog returns copies and supports token lookup", () => {
  const first = listNFTs();
  first[0].name = "Modified locally";
  assert.equal(listNFTs()[0].name, "AURA #001 — ORIGIN");
  assert.equal(getNFTByTokenId("2").name, "AURA #002 — FORCE");
  assert.equal(getNFTByTokenId("unknown"), null);
});

test("homepage links to the V3.4 product, developer and status experiences", () => {
  const html = read("public/index.html");
  assert.match(html, /href="\/product\.html"/);
  assert.match(html, /href="\/developer-guide\.html"/);
  assert.match(html, /href="\/status\.html"/);
  assert.match(html, /Nothing is sent automatically/);
});

test("standalone V3.4 pages include responsive design and a shared navigation script", () => {
  for (const file of ["public/product.html", "public/developer-guide.html", "public/status.html"]) {
    const html = read(file);
    assert.match(html, /\/v3\.4\.css/);
    assert.match(html, /\/v3\.4\.js/);
    assert.match(html, /<main/);
    assert.match(html, /name="viewport"/);
  }
});

test("developer onboarding never instructs contributors to publish private credentials", () => {
  const html = read("public/developer-guide.html");
  assert.match(html, /Never commit RPC keys, database credentials, wallet secrets or API tokens/);
  assert.match(html, /node >=20|Node\.js 20 or newer/i);
});

test("server injects the AURA V5 Solana-inspired site assets", () => {
  const server = read("server.js");
  assert.match(server, /\/aura-v5\.js/);
  assert.match(server, /\/aura-v5\.css/);
  assert.doesNotMatch(server, /\/aura-v4\.js/);
  assert.doesNotMatch(server, /\/v3\.5-cinematic\.js/);
  const layout = read("public/aura-v5.html");
  for (const id of ["home", "updates", "proof", "ecosystem", "assets", "community", "token"]) {
    assert.match(layout, new RegExp('id="' + id + '"'));
  }
  for (const item of ["ORIGIN", "FORCE", "PUBLISHED NFT ASSETS", "PUBLIC CODEBASE", "IN DEVELOPMENT", "RESEARCH ONLY"]) {
    assert.ok(layout.includes(item), "missing V5 content: " + item);
  }
  assert.match(read("public/aura-v5.js"), /dataset\.filter/);
  assert.match(read("public/aura-v5.css"), /\.a5-hero/);
  assert.match(read("public/aura-v5.css"), /@media\(max-width:760px\)/);
});

test("all AURA inner pages share V5 styling and navigation, including the NFT page", () => {
  for (const file of ["public/nft.html", "public/product.html", "public/brief.html", "public/faq.html", "public/developer-guide.html", "public/status.html", "public/404.html"]) {
    const html = read(file);
    assert.match(html, /aura-v5\.css/);
    assert.match(html, /aura-v5\.js/);
  }
  assert.match(read("public/nft.html"), /ORIGIN/);
  assert.match(read("public/nft.html"), /FORCE/);
  assert.match(read("public/aura-v5.js"), /nft\.html/);
});

test("status page loads its separately testable status module", () => {
  const html = read("public/status.html");
  const script = read("public/status.js");
  assert.match(html, /src="\/status\.js"/);
  assert.match(script, /api\/health/);
  assert.match(script, /60000/);
});

test("public discovery and not-found resources are present", () => {
  const robots = read("public/robots.txt");
  const sitemap = read("public/sitemap.xml");
  const notFound = read("public/404.html");
  assert.match(robots, /Disallow: \/api\//);
  assert.match(sitemap, /https:\/\/aurasymbol\.com\/product\.html/);
  assert.match(sitemap, /https:\/\/aurasymbol\.com\/developer-guide\.html/);
  assert.match(notFound, /RETURN TO AURA/);
});

test("all public pages include the AURA favicon and social metadata", () => {
  for (const file of [
    "public/index.html", "public/nft.html", "public/product.html",
    "public/developer-guide.html", "public/status.html",
    "public/faq.html", "public/brief.html", "public/404.html"
  ]) {
    const html = read(file);
    assert.match(html, /rel="icon"[^>]+favicon\.svg/);
  }
  for (const file of [
    "public/index.html", "public/nft.html", "public/product.html",
    "public/developer-guide.html", "public/status.html",
    "public/faq.html", "public/brief.html"
  ]) {
    const html = read(file);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:description"/);
  }
});

test("shared forest-green styles contain no saturated violet accent colors", () => {
  const files = ["public/aura-noir.css", "public/aura-v4.css", "public/aura-v5.css"];
  for (const file of files) {
    const css = read(file);
    const colors = [...new Set(css.match(/#[0-9a-f]{3,8}\b/gi) || [])];
    for (const color of colors) {
      let value = color.slice(1);
      if (value.length === 8) value = value.slice(0, 6);
      if (value.length === 4) value = value.slice(0, 3).split("").map((part) => part + part).join("");
      if (value.length === 3) value = value.split("").map((part) => part + part).join("");
      if (value.length !== 6) continue;
      const [r, g, b] = [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      let hue = 0;
      let saturation = 0;
      const lightness = (max + min) / 2;
      if (delta > 0) {
        saturation = delta / (1 - Math.abs(2 * lightness - 1));
        if (max === r) hue = ((g - b) / delta) % 6;
        else if (max === g) hue = (b - r) / delta + 2;
        else hue = (r - g) / delta + 4;
        hue = (hue * 60 + 360) % 360;
      }
      assert.ok(!(hue >= 220 && hue <= 330 && saturation > 0.15), file + " retains violet accent " + color);
    }
  }
});

test("shared navigation exposes the active page and supports Escape to close", () => {
  const script = read("public/aura-v5.js");
  assert.match(script, /aria-current="page"/);
  assert.match(script, /event\.key==="Escape"/);
  assert.match(script, /aria-expanded/);
  const css = read("public/aura-v5.css");
  assert.match(css, /\.v34-page>section/);
  assert.match(css, /minmax\(0,1fr\)/);
});

test("published NFT artwork uses lazy loading and fixed intrinsic dimensions", () => {
  for (const file of ["public/aura-v5.html", "public/nft.html"]) {
    const html = read(file);
    assert.match(html, /loading="lazy"/);
    assert.match(html, /width="1000" height="1000"/);
  }
});

test("inner pages no longer load conflicting legacy theme layers", () => {
  const versionByPage = {
    "public/nft.html": 13,
    "public/product.html": 13,
    "public/developer-guide.html": 13,
    "public/status.html": 13,
    "public/faq.html": 11,
    "public/brief.html": 11,
    "public/404.html": 11
  };
  for (const [file, version] of Object.entries(versionByPage)) {
    const html = read(file);
    assert.match(html, new RegExp("aura-v5\\\\.css\\\\?v=" + version));
    assert.doesNotMatch(html, /aura-noir\\.css|aura-v4\\.css/);
  }
});

test("AURA inner-page content keeps visible gutters and does not clip its own children", () => {
  const css = read("public/aura-v5.css");
  assert.match(css, /\.v34-page,\.a5-document\{[\s\S]*?overflow:visible!important/);
  assert.match(css, /\.a5-document\{[\s\S]*?padding:clamp\(46px,6vw,84px\) clamp\(22px,6\.2vw,96px\)!important/);
  assert.match(css, /@media\(max-width:980px\)/);
  assert.match(css, /body>header nav\.open\{display:grid!important\}/);
});

test("shared theme files contain no violet RGB gradients", () => {
  for (const file of ["public/aura-noir.css", "public/aura-v4.css", "public/aura-v5.css"]) {
    const css = read(file);
    assert.doesNotMatch(css, /rgba?\(\s*(?:104\s*,\s*77\s*,\s*151|91\s*,\s*73\s*,\s*139)\b/i);
    assert.doesNotMatch(css, /rgba?\(\s*(?:120\s*,\s*97\s*,\s*176|211\s*,\s*194\s*,\s*241)\b/i);
  }
});

test("identity challenges are cleaned up and public identity writes are rate limited", () => {
  const identity = read("server/routes/identity.js");
  assert.match(identity, /function cleanExpiredChallenges/);
  assert.match(identity, /MAX_TRACKED_CHALLENGES/);
  assert.match(identity, /function limitIdentityRequests/);
  assert.match(identity, /RATE_LIMIT_MAX/);
  assert.match(identity, /status\(429\)/);
  assert.match(identity, /Retry-After/);
  assert.match(identity, /router\.get\("\/challenge", limitIdentityRequests/);
  assert.match(identity, /router\.post\("\/", limitIdentityRequests/);
});

test("public database status does not expose raw connection error details", () => {
  const database = read("server/db.js");
  assert.match(database, /status: "unavailable"/);
  assert.doesNotMatch(database, /error: error\.message/);
});
