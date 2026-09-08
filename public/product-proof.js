(() => {
  const CONTRACT = "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593";
  const ETHERSCAN = `https://etherscan.io/address/${CONTRACT}`;
  const OPENSEA = {
    origin: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/1",
    force: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/2"
  };

  const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));

  function style() {
    if (document.getElementById("aura-product-proof-style")) return;
    const s = document.createElement("style");
    s.id = "aura-product-proof-style";
    s.textContent = `
      .aura-system-panel{margin-top:24px;border-top:1px solid #292929;border-bottom:1px solid #292929;padding:18px 0 20px}
      .aura-system-head{display:flex;justify-content:space-between;gap:20px;align-items:baseline;margin-bottom:13px}
      .aura-system-head small{color:#8f876f;letter-spacing:.18em}.aura-system-head span{font-size:9px;letter-spacing:.14em;color:#666}
      .aura-system-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:#202020;border:1px solid #202020}
      .aura-system-item{background:#0a0a0a;padding:14px 15px;min-height:72px;display:flex;flex-direction:column;justify-content:space-between}
      .aura-system-item span{font-size:9px;letter-spacing:.12em;color:#777}.aura-system-item strong{font-size:10px;letter-spacing:.1em;color:#d5c79d}
      .aura-system-item[data-state="down"] strong{color:#a88484}.aura-system-item[data-state="unknown"] strong{color:#777}
      .aura-verify-box{margin-top:24px;border:1px solid #292929;padding:20px 20px 22px;background:#090909}
      .aura-verify-head{display:flex;justify-content:space-between;gap:18px;align-items:baseline}.aura-verify-head small{color:#8f876f;letter-spacing:.18em}.aura-verify-head span{font-size:9px;letter-spacing:.12em;color:#666}
      .aura-verify-copy{margin:8px 0 16px;font-size:11px;line-height:1.65;color:#777;max-width:720px}
      .aura-verify-actions{display:flex;gap:8px;flex-wrap:wrap}.aura-verify-actions button{font:inherit;cursor:pointer}
      .aura-verify-result{margin-top:14px;border-top:1px solid #222;padding-top:14px}.aura-verify-result[hidden]{display:none}
      .aura-verify-address{font-size:10px;letter-spacing:.08em;color:#aaa;margin-bottom:10px}.aura-nft-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:#202020;border:1px solid #202020}
      .aura-nft-check{background:#0a0a0a;padding:13px 14px;display:flex;justify-content:space-between;gap:15px;align-items:baseline}.aura-nft-check span{font-size:10px;color:#999}.aura-nft-check b{font-size:10px;letter-spacing:.1em;color:#777}.aura-nft-check.owned b{color:#d5c79d}.aura-nft-check a{color:#d5c79d;text-decoration:none;font-size:9px}
      .aura-verify-error{font-size:10px;line-height:1.6;color:#a88484}.aura-verify-loading{font-size:10px;color:#777;letter-spacing:.08em}
      .aura-next-strip{margin-top:24px;border-top:1px solid #292929;padding-top:16px;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}.aura-next-strip small{display:block;color:#8f876f;letter-spacing:.18em;margin-bottom:5px}.aura-next-strip p{margin:0;font-size:11px;line-height:1.6;color:#777}.aura-next-strip a{white-space:nowrap}
      @media(max-width:800px){.aura-system-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.aura-nft-checks{grid-template-columns:1fr}.aura-next-strip{grid-template-columns:1fr}.aura-next-strip a{width:100%;text-align:center}.aura-verify-head{display:block}.aura-verify-head span{display:block;margin-top:5px}}
    `;
    document.head.appendChild(s);
  }

  async function loadSystemStatus(panel) {
    try {
      const response = await fetch("/api/health", { headers: { Accept: "application/json" } });
      const data = await response.json();
      const states = {
        website: "LIVE",
        backend: "LIVE",
        database: data.database?.status === "connected" ? "CONNECTED" : data.database?.configured ? "UNAVAILABLE" : "NOT CONFIGURED",
        ethereum: data.ethereum?.status === "connected" ? "CONNECTED" : data.ethereum?.configured ? "UNAVAILABLE" : "NOT CONFIGURED"
      };
      panel.querySelectorAll("[data-system]").forEach((item) => {
        const key = item.dataset.system;
        const value = states[key] || "UNKNOWN";
        item.dataset.state = /UNAVAILABLE|NOT CONFIGURED/.test(value) ? "down" : "live";
        const target = item.querySelector("strong");
        if (target) target.textContent = value;
      });
      panel.querySelector("[data-updated]").textContent = `CHECKED ${new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}`;
    } catch {
      panel.querySelectorAll("[data-system]").forEach((item) => { item.dataset.state = "unknown"; item.querySelector("strong").textContent = "UNAVAILABLE"; });
    }
  }

  function addSystemStatus() {
    const proof = document.getElementById("proof");
    if (!proof || proof.querySelector(".aura-system-panel")) return;
    const panel = document.createElement("div");
    panel.className = "wrap aura-system-panel";
    panel.innerHTML = `<div class="aura-system-head"><small>LIVE SYSTEM STATUS</small><span data-updated>CHECKING…</span></div><div class="aura-system-grid"><div class="aura-system-item" data-system="website"><span>WEBSITE</span><strong>CHECKING</strong></div><div class="aura-system-item" data-system="backend"><span>BACKEND</span><strong>CHECKING</strong></div><div class="aura-system-item" data-system="database"><span>DATABASE</span><strong>CHECKING</strong></div><div class="aura-system-item" data-system="ethereum"><span>ETHEREUM RPC</span><strong>CHECKING</strong></div></div>`;
    const evidence = proof.querySelector(".live-proof-panel");
    if (evidence) evidence.after(panel); else proof.querySelector(".proof-grid")?.parentElement?.after(panel);
    loadSystemStatus(panel);
  }

  function getWalletAddress() {
    return window.ethereum?.selectedAddress || null;
  }

  async function connectWallet() {
    if (!window.ethereum) throw new Error("No compatible wallet was detected. Install MetaMask or another EVM wallet.");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts?.[0]) throw new Error("No wallet account was selected.");
    return accounts[0];
  }

  async function verify(address, result) {
    result.hidden = false;
    result.innerHTML = `<div class="aura-verify-loading">VERIFYING ON ETHEREUM MAINNET…</div>`;
    try {
      const response = await fetch(`/api/nfts/verify?address=${encodeURIComponent(address)}`, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok || data.status !== "verified") throw new Error(data.error || "Verification is currently unavailable.");
      result.innerHTML = `<div class="aura-verify-address">WALLET ${esc(data.address)} · CHAIN ${esc(data.chainId)} · READ-ONLY</div><div class="aura-nft-checks">${data.nfts.map((nft) => { const link = nft.tokenId === 1 ? OPENSEA.origin : OPENSEA.force; return `<div class="aura-nft-check ${nft.owned ? "owned" : ""}"><span>#${esc(nft.tokenId)} ${esc(nft.name.replace(/^AURA #\d+\s*[—-]?\s*/i,""))}</span><b>${nft.owned ? `OWNED · ${esc(nft.balance)}` : "NOT OWNED"}</b><a target="_blank" rel="noopener noreferrer" href="${link}">VIEW ↗</a></div>`; }).join("")}</div>`;
    } catch (error) {
      result.innerHTML = `<div class="aura-verify-error">${esc(error.message)}<br><span>This check is read-only. No transaction is requested.</span></div>`;
    }
  }

  function addVerifier() {
    const proof = document.getElementById("proof");
    if (!proof || proof.querySelector(".aura-verify-box")) return;
    const box = document.createElement("div");
    box.className = "wrap aura-verify-box";
    box.innerHTML = `<div class="aura-verify-head"><small>READ-ONLY NFT VERIFICATION</small><span>ETHEREUM MAINNET · ERC-1155</span></div><p class="aura-verify-copy">Connect a wallet to check whether it holds AURA #001 ORIGIN or AURA #002 FORCE. AURA does not request a transaction or move assets during this check.</p><div class="aura-verify-actions"><button class="btn gold" type="button" data-verify-connect>CONNECT & VERIFY</button><a class="btn" target="_blank" rel="noopener noreferrer" href="${ETHERSCAN}">VERIFY CONTRACT ↗</a></div><div class="aura-verify-result" data-verify-result hidden></div>`;
    const status = proof.querySelector(".aura-system-panel");
    if (status) status.after(box); else proof.querySelector(".live-proof-panel")?.after(box);
    box.querySelector("[data-verify-connect]").addEventListener("click", async () => {
      const button = box.querySelector("[data-verify-connect]");
      const result = box.querySelector("[data-verify-result]");
      button.disabled = true;
      button.textContent = "CONNECTING…";
      try {
        const address = getWalletAddress() || await connectWallet();
        button.textContent = "VERIFY AGAIN";
        await verify(address, result);
      } catch (error) {
        result.hidden = false;
        result.innerHTML = `<div class="aura-verify-error">${esc(error.message)}</div>`;
      } finally { button.disabled = false; }
    });
    const address = getWalletAddress();
    if (address) verify(address, box.querySelector("[data-verify-result]"));
    if (window.ethereum) window.ethereum.on("accountsChanged", (accounts) => { if (accounts?.[0]) verify(accounts[0], box.querySelector("[data-verify-result]")); });
  }

  function addNextStrip() {
    const proof = document.getElementById("proof");
    if (!proof || proof.querySelector(".aura-next-strip")) return;
    const strip = document.createElement("div");
    strip.className = "wrap aura-next-strip";
    strip.innerHTML = `<div><small>FROM PROOF TO PARTICIPATION</small><p>The evidence is live. The next layer is product, infrastructure and people.</p></div><a class="btn gold" href="#developers">SEE THE BUILD →</a>`;
    proof.append(strip);
  }

  function run() {
    style();
    addSystemStatus();
    addVerifier();
    addNextStrip();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
  window.addEventListener("hashchange", () => setTimeout(run, 0));
})();
