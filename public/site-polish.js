(() => {
  const CONTRACT = "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593";
  const ETHERSCAN = `https://etherscan.io/address/${CONTRACT}`;
  const OPENSEA = {
    origin: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/1",
    force: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/2"
  };

  const externalLink = (href, label) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label;
    return a;
  };

  function polishProof() {
    const proof = document.getElementById("proof");
    if (!proof || proof.querySelector(".live-proof-panel")) return;
    const wrap = document.createElement("div");
    wrap.className = "wrap live-proof-panel";
    wrap.innerHTML = `
      <small>LIVE / VERIFIABLE EVIDENCE</small>
      <div class="live-proof-grid">
        <div><span>NFT #001</span><strong>ORIGIN</strong><a target="_blank" rel="noopener noreferrer" href="${OPENSEA.origin}">OPEN ON OPENSEA ↗</a></div>
        <div><span>NFT #002</span><strong>FORCE</strong><a target="_blank" rel="noopener noreferrer" href="${OPENSEA.force}">OPEN ON OPENSEA ↗</a></div>
        <div><span>CONTRACT</span><strong>ERC-1155 / ETHEREUM</strong><a target="_blank" rel="noopener noreferrer" href="${ETHERSCAN}">VERIFY ON ETHERSCAN ↗</a></div>
      </div>
      <p class="live-proof-note">The NFT layer is deployed on Ethereum. Other smart contracts are not deployed yet. AURA shows this distinction deliberately.</p>`;
    const first = proof.querySelector(".proof-grid")?.parentElement;
    if (first) first.after(wrap);
  }

  function polishNfts() {
    const nftSection = document.getElementById("nft");
    if (!nftSection) return;
    const cards = nftSection.querySelectorAll(".gallery article");
    cards.forEach((card, index) => {
      if (card.querySelector(".verification-links")) return;
      const key = index === 0 ? "origin" : index === 1 ? "force" : null;
      if (!key) return;
      const box = document.createElement("div");
      box.className = "verification-links";
      box.append(externalLink(OPENSEA[key], "VIEW ON OPENSEA ↗"));
      box.append(externalLink(ETHERSCAN, "VERIFY CONTRACT ↗"));
      card.querySelector(".meta")?.after(box);
    });
  }

  function polishWallet() {
    const card = document.getElementById("auraWalletCard");
    if (!card || card.querySelector(".mvp-note")) return;
    const note = document.createElement("div");
    note.className = "mvp-note";
    note.innerHTML = "<b>LIVE PRODUCT EXPERIMENT</b><span>Wallet connection · signed identity · read-only NFT verification</span>";
    card.append(note);
  }

  function polishContact() {
    const form = document.getElementById("contactForm");
    if (!form || form.dataset.auraContactFixed) return;
    form.dataset.auraContactFixed = "true";
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(form);
      const type = data.get("type") || "General";
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const message = data.get("message") || "";
      const subject = encodeURIComponent(`AURA ${type} inquiry — ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nType: ${type}\n\n${message}`);
      const xUrl = `https://x.com/AURASymbol?text=${encodeURIComponent("AURA " + type + " inquiry: " + message)}`;
      const note = form.querySelector(".form-note") || document.createElement("div");
      note.className = "form-note contact-result";
      note.innerHTML = `Direct email is not configured yet. <a href="${xUrl}" target="_blank" rel="noopener noreferrer">Contact AURA on X ↗</a>`;
      form.append(note);
      window.open(xUrl, "_blank", "noopener,noreferrer");
    }, { capture: true });
  }

  function run() {
    polishProof();
    polishNfts();
    polishWallet();
    polishContact();
  }

  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
