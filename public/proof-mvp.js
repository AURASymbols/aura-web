(() => {
  const CONTRACT = "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593";
  const ETHERSCAN = `https://etherscan.io/address/${CONTRACT}`;
  const OPENSEA = {
    origin: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/1",
    force: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/2"
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const shortAddress = (address) => address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  function installStyle() {
    if (document.getElementById("aura-proof-mvp-style")) return;
    const style = document.createElement("style");
    style.id = "aura-proof-mvp-style";
    style.textContent = `
      .aura-proof-mvp{margin-top:34px;border-top:1px solid #292929;border-bottom:1px solid #292929;padding:20px 0 22px}
      .aura-proof-mvp>small{display:block;color:#8f876f;letter-spacing:.18em;margin-bottom:14px}
      .aura-proof-mvp-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:1px;background:#202020;border:1px solid #202020}
      .aura-proof-mvp-panel{background:#0a0a0a;padding:20px}
      .aura-proof-mvp-panel h3{margin:0 0 8px;font-size:13px;letter-spacing:.08em;font-weight:500}
      .aura-proof-mvp-panel p{margin:0;color:#777;font-size:10px;line-height:1.7}
      .aura-proof-status{margin-top:16px;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#202020;border:1px solid #202020}
      .aura-proof-status>div{background:#0b0b0b;padding:12px 13px}
      .aura-proof-status span{display:block;color:#777;font-size:8px;letter-spacing:.14em}
      .aura-proof-status strong{display:block;margin-top:5px;color:#d5c79d;font-size:10px;letter-spacing:.08em;font-weight:500}
      .aura-proof-action{margin-top:15px;display:flex;gap:9px;align-items:center;flex-wrap:wrap}
      .aura-proof-action button{appearance:none;border:1px solid #5c5544;background:#111;color:#d5c79d;padding:10px 14px;font:inherit;font-size:9px;letter-spacing:.14em;cursor:pointer}
      .aura-proof-action button:hover{border-color:#d5c79d}
      .aura-proof-action button:disabled{opacity:.5;cursor:wait}
      .aura-proof-result{margin-top:13px;border-top:1px solid #292929;padding-top:13px;color:#777;font-size:10px;line-height:1.65}
      .aura-proof-result b{color:#d5c79d;font-weight:500}
      .aura-proof-nfts{margin-top:9px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:#202020;border:1px solid #202020}
      .aura-proof-nfts>div{background:#0d0d0d;padding:12px}
      .aura-proof-nfts span{display:block;color:#777;font-size:8px;letter-spacing:.12em}
      .aura-proof-nfts strong{display:block;margin-top:4px;color:#ddd;font-size:11px}
      .aura-proof-nfts em{display:block;margin-top:5px;color:#8f876f;font-size:9px;font-style:normal}
      .aura-proof-links{margin-top:12px;display:flex;gap:14px;flex-wrap:wrap}
      .aura-proof-links a{color:#a79d82;font-size:9px;letter-spacing:.1em;text-decoration:none}.aura-proof-links a:hover{color:#d5c79d;text-decoration:underline}
      .aura-proof-footnote{margin-top:14px!important;color:#5f5f5f!important;font-size:9px!important;line-height:1.65!important}
      @media(max-width:800px){.aura-proof-mvp-grid{grid-template-columns:1fr}.aura-proof-status{grid-template-columns:repeat(2,1fr)}.aura-proof-nfts{grid-template-columns:1fr}.aura-proof-action button{width:100%}}
    `;
    document.head.append(style);
  }

  function renderProofMvp() {
    const proof = document.getElementById("proof");
    if (!proof || proof.querySelector(".aura-proof-mvp")) return;
    const wrap = document.createElement("div");
    wrap.className = "wrap aura-proof-mvp";
    wrap.innerHTML = `
      <small>LIVE SYSTEM / READ-ONLY</small>
      <div class="aura-proof-mvp-grid">
        <div class="aura-proof-mvp-panel">
          <h3>Verify the layer, not the promise.</h3>
          <p>AURA's current MVP can connect an EVM wallet and perform read-only checks against the deployed NFT layer. No transaction is required to verify ownership.</p>
          <div class="aura-proof-action">
            <button type="button" id="auraVerifyWallet">CONNECT &amp; VERIFY WALLET</button>
          </div>
          <div class="aura-proof-result" id="auraVerifyResult">Waiting for a wallet connection.</div>
        </div>
        <div class="aura-proof-mvp-panel">
          <h3>Project system status</h3>
          <p>These states describe the current build. They are intentionally separate from future plans.</p>
          <div class="aura-proof-status" id="auraSystemStatus">
            <div><span>WEBSITE</span><strong>CHECKING</strong></div>
            <div><span>BACKEND</span><strong>CHECKING</strong></div>
            <div><span>DATABASE</span><strong>CHECKING</strong></div>
            <div><span>ETHEREUM</span><strong>CHECKING</strong></div>
          </div>
        </div>
      </div>
      <div class="aura-proof-links">
        <a target="_blank" rel="noopener noreferrer" href="${OPENSEA.origin}">NFT #001 / ORIGIN ↗</a>
        <a target="_blank" rel="noopener noreferrer" href="${OPENSEA.force}">NFT #002 / FORCE ↗</a>
        <a target="_blank" rel="noopener noreferrer" href="${ETHERSCAN}">CONTRACT / ETHERSCAN ↗</a>
      </div>
      <p class="aura-proof-footnote">Ethereum mainnet · ERC-1155 · ${CONTRACT} · NFT layer deployed. Additional smart contracts are not deployed yet.</p>
    `;
    const existing = proof.querySelector(".live-proof-panel");
    if (existing) existing.after(wrap); else proof.append(wrap);
    document.getElementById("auraVerifyWallet")?.addEventListener("click", verifyWallet);
    loadSystemStatus();
  }

  function setSystemStatus(values) {
    const root = document.getElementById("auraSystemStatus");
    if (!root) return;
    const cells = root.querySelectorAll("strong");
    [values.website, values.backend, values.database, values.ethereum].forEach((value, i) => {
      if (cells[i]) cells[i].textContent = String(value || "UNKNOWN").toUpperCase();
    });
  }

  async function loadSystemStatus() {
    try {
      const response = await fetch("/api/health", { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Health check unavailable");
      setSystemStatus({
        website: "LIVE",
        backend: "LIVE",
        database: data.database?.status || (data.database?.configured ? "CONNECTED" : "NOT CONFIGURED"),
        ethereum: data.ethereum?.status || (data.ethereum?.configured ? "CONNECTED" : "NOT CONFIGURED")
      });
    } catch {
      setSystemStatus({website:"LIVE",backend:"UNAVAILABLE",database:"UNKNOWN",ethereum:"UNAVAILABLE"});
    }
  }

  async function verifyWallet() {
    const button = document.getElementById("auraVerifyWallet");
    const result = document.getElementById("auraVerifyResult");
    if (!button || !result) return;
    if (!window.ethereum) {
      result.innerHTML = "<b>WALLET NOT FOUND.</b> Install or enable an EVM wallet such as MetaMask to run the read-only check.";
      return;
    }
    button.disabled = true;
    button.textContent = "CHECKING WALLET…";
    result.textContent = "Connecting to the wallet and checking the deployed NFT layer…";
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts?.[0];
      if (!address) throw new Error("No wallet account was returned.");
      const response = await fetch(`/api/nfts/verify?address=${encodeURIComponent(address)}`, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok || data.status !== "verified") throw new Error(data.error || "Verification is currently unavailable.");
      const nftHtml = (data.nfts || []).map((nft) => `<div><span>NFT #${escapeHtml(nft.tokenId)}</span><strong>${escapeHtml(nft.name)}</strong><em>${nft.owned ? `OWNED · BALANCE ${escapeHtml(nft.balance)}` : "NOT HELD BY THIS WALLET"}</em></div>`).join("");
      result.innerHTML = `<b>VERIFIED ON ETHEREUM MAINNET.</b><br>${escapeHtml(shortAddress(address))} · read-only check · chain ${escapeHtml(data.chainId)}<div class="aura-proof-nfts">${nftHtml}</div>`;
    } catch (error) {
      result.innerHTML = `<b>VERIFICATION UNAVAILABLE.</b><br>${escapeHtml(error.message || "Unable to complete the read-only check.")}<br><span>This does not change wallet assets or send a transaction.</span>`;
    } finally {
      button.disabled = false;
      button.textContent = "CONNECT & VERIFY WALLET";
    }
  }

  function init() {
    installStyle();
    renderProofMvp();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
