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


