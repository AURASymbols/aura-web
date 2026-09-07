const SITE = {
  github: "https://github.com/AURASymbols/aura-web",
  x: "https://x.com/AURASymbol",
  opensea: {
    origin: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/1",
    force: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/2"
  }
};

const menu = document.getElementById("menu");
const nav = document.getElementById("nav");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

function closeMenu() { nav?.classList.remove("open"); }
function closeModal() { modal?.classList.remove("open"); }
function showModal(title, text) {
  if (modalTitle) modalTitle.textContent = title;
  if (modalText) modalText.textContent = text;
  modal?.classList.add("open");
}

menu?.addEventListener("click", () => nav?.classList.toggle("open"));
nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
document.getElementById("close")?.addEventListener("click", closeModal);
document.getElementById("ok")?.addEventListener("click", closeModal);
modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });

document.querySelectorAll(".opensea").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.key;
    const title = button.dataset.nft;
    const url = SITE.opensea[key];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    showModal(title, "The OpenSea link is not configured for this item yet.");
  });
});

const pages = [...document.querySelectorAll("section.page")];

function showRoute() {
  const route = (location.hash || "#home").replace("#", "") || "home";
  const target = document.getElementById(route) || document.getElementById("home");
  pages.forEach(page => page.classList.toggle("active", page === target));
  document.body.classList.toggle("route-home", target.id === "home");
  document.querySelectorAll("nav a").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${target.id}`);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("hashchange", showRoute);
showRoute();

/* MVP v0.1 — Wallet Connection + AURA Identity
   Wallet signatures verify ownership of the connected address.
   No private keys, wallet credentials or transaction approvals are handled by AURA. */
const walletState = {
  address: null,
  chainId: null,
  provider: null,
  identity: null,
  identityLoading: false
};

function shortAddress(address) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function walletUi() {
  if (document.getElementById("auraWalletCard")) return;

  const hero = document.querySelector("#home .hero");
  if (!hero) return;

  const card = document.createElement("div");
  card.id = "auraWalletCard";
  card.className = "aura-wallet-card";
  card.innerHTML = `
    <div>
      <small>AURA / MVP v0.1</small>
      <strong id="auraWalletStatus">Wallet not connected</strong>
      <span id="auraWalletDetail">Connect an EVM wallet to begin the AURA product flow.</span>
      <div id="auraIdentityArea" class="aura-identity-area"></div>
    </div>
    <button id="auraConnect" class="btn gold" type="button">CONNECT WALLET</button>
  `;
  hero.querySelector(".buttons")?.after(card);

  document.getElementById("auraConnect")?.addEventListener("click", connectWallet);
}

function updateWalletUi() {
  const status = document.getElementById("auraWalletStatus");
  const detail = document.getElementById("auraWalletDetail");
  const button = document.getElementById("auraConnect");
  const identityArea = document.getElementById("auraIdentityArea");
  if (!status || !detail || !button || !identityArea) return;

  if (!walletState.address) {
    status.textContent = "Wallet not connected";
    detail.textContent = window.ethereum
      ? "Connect an EVM wallet to begin the AURA product flow."
      : "No injected EVM wallet detected. Install a compatible wallet to continue.";
    identityArea.innerHTML = "";
    button.textContent = "CONNECT WALLET";
    return;
  }

  status.textContent = shortAddress(walletState.address);
  detail.textContent = `Connected · Chain ID ${walletState.chainId || "unknown"}`;
  button.textContent = "DISCONNECT";

  if (walletState.identityLoading) {
    identityArea.innerHTML = `<div class="aura-identity-status">Checking AURA Identity…</div>`;
  } else if (walletState.identity) {
    const name = walletState.identity.display_name || "AURA Identity";
    identityArea.innerHTML = `<div class="aura-identity-status established"><span>IDENTITY</span><strong>${escapeHtml(name)}</strong><small>Wallet-linked · Application record · Not on-chain</small></div>`;
  } else {
    identityArea.innerHTML = `<div class="aura-identity-create"><span>Wallet connected. Your AURA Identity has not been established.</span><button id="auraIdentityButton" class="btn" type="button">ESTABLISH AURA IDENTITY</button></div>`;
    document.getElementById("auraIdentityButton")?.addEventListener("click", establishIdentity);
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));
}

async function connectWallet() {
  if (!window.ethereum) {
    showModal("Wallet not available", "AURA currently requires an injected EVM wallet such as MetaMask. No wallet was found in this browser.");
    return;
  }

  const button = document.getElementById("auraConnect");
  if (walletState.address) {
    walletState.address = null;
    walletState.chainId = null;
    walletState.provider = null;
    walletState.identity = null;
    updateWalletUi();
    return;
  }

  try {
    button && (button.disabled = true);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts?.length) return;

    walletState.address = accounts[0];
    walletState.chainId = await window.ethereum.request({ method: "eth_chainId" });
    walletState.provider = window.ethereum;
    updateWalletUi();
    await loadIdentity();
  } catch (error) {
    showModal("Wallet connection cancelled", error?.message || "The wallet connection could not be completed.");
  } finally {
    button && (button.disabled = false);
  }
}

async function loadIdentity() {
  if (!walletState.address) return;
  walletState.identityLoading = true;
  updateWalletUi();

  try {
    const response = await fetch(`/api/identity?address=${encodeURIComponent(walletState.address)}`);
    if (response.status === 404) {
      walletState.identity = null;
      return;
    }
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Identity lookup failed.");
    }
    const data = await response.json();
    walletState.identity = data.identity || null;
  } catch (error) {
    walletState.identity = null;
    showModal("Identity service unavailable", error?.message || "AURA could not check the identity service.");
  } finally {
    walletState.identityLoading = false;
    updateWalletUi();
  }
}

async function establishIdentity() {
  if (!walletState.address || !walletState.provider) return;

  walletState.identityLoading = true;
  updateWalletUi();

  try {
    const challengeResponse = await fetch(`/api/identity/challenge?address=${encodeURIComponent(walletState.address)}`);
    const challengeData = await challengeResponse.json().catch(() => ({}));
    if (!challengeResponse.ok) throw new Error(challengeData.error || "Could not start identity verification.");

    const signature = await walletState.provider.request({
      method: "personal_sign",
      params: [challengeData.message, walletState.address]
    });

    const createResponse = await fetch("/api/identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: walletState.address,
        chainId: walletState.chainId,
        signature
      })
    });

    const createData = await createResponse.json().catch(() => ({}));
    if (!createResponse.ok) throw new Error(createData.error || "AURA Identity could not be established.");

    walletState.identity = createData.identity;
  } catch (error) {
    showModal("Identity verification stopped", error?.message || "The AURA Identity flow could not be completed.");
  } finally {
    walletState.identityLoading = false;
    updateWalletUi();
  }
}

function handleAccountsChanged(accounts) {
  walletState.address = accounts?.[0] || null;
  walletState.identity = null;
  if (!walletState.address) {
    walletState.chainId = null;
    walletState.provider = null;
  }
  updateWalletUi();
  if (walletState.address) loadIdentity();
}

async function handleChainChanged(chainId) {
  walletState.chainId = chainId || null;
  walletState.identity = null;
  updateWalletUi();
  if (walletState.address) loadIdentity();
}

function initWallet() {
  walletUi();
  updateWalletUi();

  if (!window.ethereum) return;
  window.ethereum.on?.("accountsChanged", handleAccountsChanged);
  window.ethereum.on?.("chainChanged", handleChainChanged);
}

initWallet();

const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const type = data.get("type") || "General";
  const name = data.get("name") || "";
  const email = data.get("email") || "";
  const message = data.get("message") || "";
  const subject = encodeURIComponent(`AURA ${type} inquiry — ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nType: ${type}\n\n${message}`);
  window.location.href = `mailto:hello@aura.example?subject=${subject}&body=${body}`;
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

fetch("/api/status")
  .then(r => r.json())
  .then(status => console.log("AURA", status))
  .catch(() => {});

const walletStyle = document.createElement("style");
walletStyle.textContent = `
.aura-wallet-card{margin-top:24px;border:1px solid #292929;background:rgba(255,255,255,.025);padding:18px 20px;display:flex;justify-content:space-between;align-items:center;gap:20px;max-width:760px}
.aura-wallet-card>div{display:grid;gap:4px}.aura-wallet-card strong{font-size:13px;letter-spacing:.08em}.aura-wallet-card span{color:#777;font-size:11px}.aura-wallet-card button:disabled{opacity:.5;cursor:wait}
.aura-identity-area{margin-top:12px}.aura-identity-status{display:grid;gap:3px;padding-top:10px;border-top:1px solid #222}.aura-identity-status span{font-size:9px;letter-spacing:.16em;color:#888}.aura-identity-status small{color:#666;font-size:10px}.aura-identity-create{display:grid;gap:9px;padding-top:10px;border-top:1px solid #222;color:#777;font-size:11px}.aura-identity-create .btn{width:max-content}.aura-identity-status.established strong{font-size:15px}
@media(max-width:800px){.aura-wallet-card{align-items:flex-start;flex-direction:column}.aura-wallet-card .btn{width:100%}.aura-identity-create .btn{width:100%}}
`;
document.head.appendChild(walletStyle);
