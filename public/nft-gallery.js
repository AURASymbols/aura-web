(() => {
  const NFTs = [
    {
      tokenId: "1",
      number: "001",
      name: "ORIGIN",
      image: "/assets/aura-001-origin.png",
      description: "The first AURA work — the beginning of the AURA mark.",
      standard: "ERC-1155",
      contract: "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593",
      openSea: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/1"
    },
    {
      tokenId: "2",
      number: "002",
      name: "FORCE",
      image: "/assets/aura-002-force.png",
      description: "Energy, resistance and momentum — the second AURA work.",
      standard: "ERC-1155",
      contract: "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593",
      openSea: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/2"
    }
  ];

  function injectStyles() {
    if (document.getElementById("aura-nft-gallery-styles")) return;
    const style = document.createElement("style");
    style.id = "aura-nft-gallery-styles";
    style.textContent = `
      .aura-public-nft{border-top:1px solid #222;padding:90px 8vw;background:#080808}
      .aura-public-nft-head{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:38px}
      .aura-public-nft-head h2{margin:12px 0 0;font-size:clamp(42px,5vw,72px);line-height:.95}
      .aura-public-nft-lead{max-width:680px;color:#999;margin:0 0 40px;font-size:16px}
      .aura-public-nft-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
      .aura-public-nft-card{border:1px solid #292929;background:#0d0d0d;overflow:hidden}
      .aura-public-nft-card img{display:block;width:100%;aspect-ratio:1;object-fit:cover;background:#f7f7f5}
      .aura-public-nft-body{padding:24px}
      .aura-public-nft-kicker{font-size:9px;letter-spacing:.2em;color:#a99f80}
      .aura-public-nft-body h3{font-size:28px;margin:8px 0 10px;letter-spacing:.02em}
      .aura-public-nft-body p{color:#999;min-height:52px}
      .aura-public-nft-meta{border-block:1px solid #292929;padding:13px 0;margin:20px 0;display:flex;justify-content:space-between;gap:12px;font-size:9px;color:#777;letter-spacing:.12em}
      .aura-public-nft-meta strong{color:#ddd}
      .aura-public-nft-actions{display:flex;gap:9px;flex-wrap:wrap}
      .aura-public-nft-actions a{display:inline-flex;align-items:center;min-height:42px;padding:0 15px;border:1px solid #555;color:#fff;text-decoration:none;font-size:9px;font-weight:bold;letter-spacing:.14em}
      .aura-public-nft-actions a:hover{border-color:#fff}
      .aura-public-nft-actions a.primary{background:#e7dcb9;color:#080808;border-color:#e7dcb9}
      .aura-public-nft-contract{font-size:9px;color:#666;word-break:break-all;margin-top:16px}
      @media(max-width:800px){.aura-public-nft{padding:70px 6vw}.aura-public-nft-head{display:block}.aura-public-nft-grid{grid-template-columns:1fr}.aura-public-nft-body p{min-height:0}}
    `;
    document.head.appendChild(style);
  }

  function render() {
    if (document.getElementById("auraPublicNft")) return;
    const home = document.getElementById("home");
    if (!home) return;

    injectStyles();
    const section = document.createElement("section");
    section.id = "auraPublicNft";
    section.className = "aura-public-nft";
    section.innerHTML = `
      <div class="aura-public-nft-head">
        <div><small>AURA / PUBLIC COLLECTION</small><h2>See the work.<br><i>Before the wallet.</i></h2></div>
        <span class="aura-public-nft-kicker">2 PUBLISHED WORKS · ETHEREUM</span>
      </div>
      <p class="aura-public-nft-lead">The AURA collection is public. Anyone can view the artwork and verify the published records. A wallet is only needed for wallet-specific ownership checks.</p>
      <div class="aura-public-nft-grid">
        ${NFTs.map(nft => `
          <article class="aura-public-nft-card">
            <img src="${nft.image}" alt="AURA #${nft.number} — ${nft.name}" loading="lazy">
            <div class="aura-public-nft-body">
              <span class="aura-public-nft-kicker">AURA #${nft.number}</span>
              <h3>${nft.name}</h3>
              <p>${nft.description}</p>
              <div class="aura-public-nft-meta"><span>${nft.standard}</span><strong>ETHEREUM</strong><span>TOKEN ${nft.tokenId}</span></div>
              <div class="aura-public-nft-actions">
                <a class="primary" href="${nft.openSea}" target="_blank" rel="noopener noreferrer">VIEW ON OPENSEA ↗</a>
                <a href="${nft.openSea}" target="_blank" rel="noopener noreferrer">VIEW RECORD ↗</a>
              </div>
              <div class="aura-public-nft-contract">CONTRACT · ${nft.contract}</div>
            </div>
          </article>
        `).join("")}
      </div>
    `;

    const existingNftPage = document.getElementById("nft");
    if (existingNftPage) {
      existingNftPage.parentNode.insertBefore(section, existingNftPage);
    } else {
      const call = home.querySelector(".call");
      if (call) home.insertBefore(section, call);
      else home.appendChild(section);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render, { once: true });
  else render();
})();
