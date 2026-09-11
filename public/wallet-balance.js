(() => {
  const AREA_ID = "auraWalletBalanceArea";

  function shortAddress(address) {
    return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
  }

  function getArea() {
    let area = document.getElementById(AREA_ID);
    const detail = document.getElementById("auraWalletDetail");

    if (!area && detail) {
      area = document.createElement("div");
      area.id = AREA_ID;
      area.style.marginTop = "14px";
      detail.insertAdjacentElement("afterend", area);
    }

    return area;
  }

  function renderLoading(address) {
    const area = getArea();
    if (!area) return;

    area.innerHTML = `
      <div class="aura-wallet-balance" style="padding:14px 16px;border:1px solid rgba(212,175,55,.35);margin-top:10px;">
        <small style="display:block;opacity:.7;letter-spacing:.12em;">ETHEREUM MAINNET</small>
        <strong style="display:block;margin-top:5px;">Loading balance…</strong>
        <span style="display:block;margin-top:4px;opacity:.65;font-size:.85em;">${shortAddress(address)}</span>
      </div>`;
  }

  function renderBalance(data) {
    const area = getArea();
    if (!area) return;

    const eth = Number(data.balanceEth);
    const formatted = Number.isFinite(eth)
      ? eth.toLocaleString(undefined, { maximumFractionDigits: 6 })
      : data.balanceEth;

    area.innerHTML = `
      <div class="aura-wallet-balance" style="padding:14px 16px;border:1px solid rgba(212,175,55,.35);margin-top:10px;">
        <small style="display:block;opacity:.7;letter-spacing:.12em;">ETHEREUM MAINNET</small>
        <strong style="display:block;margin-top:5px;font-size:1.15em;">${formatted} ETH</strong>
        <span style="display:block;margin-top:4px;opacity:.65;font-size:.85em;">${shortAddress(data.address)} · Chain ${data.chainId}</span>
      </div>`;
  }

  function renderUnavailable(message) {
    const area = getArea();
    if (!area) return;

    area.innerHTML = `
      <div class="aura-wallet-balance" style="padding:14px 16px;border:1px solid #292929;margin-top:10px;">
        <small style="display:block;opacity:.7;letter-spacing:.12em;">ETHEREUM MAINNET</small>
        <strong style="display:block;margin-top:5px;">Balance not configured</strong>
        <span style="display:block;margin-top:4px;opacity:.65;font-size:.85em;">${message || "A public RPC endpoint is not configured in this demo environment."}</span>
      </div>`;
  }

  function renderError(message) {
    const area = getArea();
    if (!area) return;

    area.innerHTML = `
      <div class="aura-wallet-balance" style="padding:14px 16px;border:1px solid #292929;margin-top:10px;">
        <small style="display:block;opacity:.7;letter-spacing:.12em;">ETHEREUM MAINNET</small>
        <strong style="display:block;margin-top:5px;">Balance temporarily unavailable</strong>
        <span style="display:block;margin-top:4px;opacity:.65;font-size:.85em;">${message || "Unable to read wallet balance right now."}</span>
      </div>`;
  }

  async function loadBalance(address) {
    if (!address) {
      const area = document.getElementById(AREA_ID);
      if (area) area.innerHTML = "";
      return;
    }

    renderLoading(address);

    try {
      const response = await fetch(`/api/wallet/${encodeURIComponent(address)}`, {
        headers: { Accept: "application/json" }
      });
      const data = await response.json();

      if (data.status === "not-configured") {
        renderUnavailable(data.error);
        return;
      }

      if (!response.ok || data.status !== "connected") {
        throw new Error(data.error || "Unable to read wallet balance.");
      }

      renderBalance(data);
    } catch (error) {
      renderError(error.message);
    }
  }

  async function syncWallet() {
    if (!window.ethereum) {
      const area = document.getElementById(AREA_ID);
      if (area) area.innerHTML = "";
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      await loadBalance(accounts?.[0] || null);
    } catch (error) {
      renderError(error.message);
    }
  }

  function suppressBlockingIdentityModal() {
    const modal = document.getElementById("modal");
    const title = document.getElementById("modalTitle");
    if (!modal || !title) return;

    const observer = new MutationObserver(() => {
      if (modal.classList.contains("open") && title.textContent.includes("Identity service unavailable")) {
        modal.classList.remove("open");

        const identityArea = document.getElementById("auraIdentityArea");
        if (identityArea && !identityArea.textContent.includes("Identity service")) {
          identityArea.insertAdjacentHTML("afterbegin", `
            <div class="aura-identity-status" style="margin-bottom:8px;">
              <span>IDENTITY</span>
              <strong>Public demo mode</strong>
              <small>Identity storage is not configured here. Developers can enable it with DATABASE_URL.</small>
            </div>`);
        }
      }
    });

    observer.observe(modal, { attributes: true, attributeFilter: ["class"] });
    observer.observe(title, { childList: true, characterData: true, subtree: true });
  }

  function observeWalletCard() {
    if (document.getElementById("auraWalletDetail")) {
      syncWallet();
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.getElementById("auraWalletDetail")) {
        observer.disconnect();
        syncWallet();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    suppressBlockingIdentityModal();
    observeWalletCard();
  });

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      loadBalance(accounts?.[0] || null);
    });
    window.ethereum.on("chainChanged", () => {
      syncWallet();
    });
  }
})();
