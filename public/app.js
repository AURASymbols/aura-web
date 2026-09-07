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
    if (modalTitle) modalTitle.textContent = title;
    if (modalText) modalText.textContent = "The OpenSea link is not configured for this item yet.";
    modal?.classList.add("open");
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

/* MVP v0.1 — Wallet Connection
   Read-only browser wallet access only. No private keys or custody. */
const walletState = {
  address: null,
  chainId: null,
  provider: null
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
  if (!status || !detail || !button) return;

  if (!walletState.address) {
    status.textContent = "Wallet not connected";
    detail.textContent = window.ethereum
      ? "Connect an EVM wallet to begin the AURA product flow."
      : "No injected EVM wallet detected. Install a compatible wallet to continue.";
    button.textContent = "CONNECT WALLET";
    return;
  }

  status.textContent = shortAddress(walletState.address);
  detail.textContent = `Connected · Chain ID ${walletState.chainId || "unknown"}`;
  button.textContent = "DISCONNECT";
}

async function connectWallet() {
  if (!window.ethereum) {
    if (modalTitle) modalTitle.textContent = "Wallet not available";
    if (modalText) modalText.textContent = "AURA currently requires an injected EVM wallet such as MetaMask. No wallet was found in this browser.";
    modal?.classList.add("open");
    return;
  }

  const button = document.getElementById("auraConnect");
  if (walletState.address) {
    walletState.address = null;
    walletState.chainId = null;
    walletState.provider = null;
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
  } catch (error) {
    if (modalTitle) modalTitle.textContent = "Wallet connection cancelled";
    if (modalText) modalText.textContent = error?.message || "The wallet connection could not be completed.";
    modal?.classList.add("open");
  } finally {
    button && (button.disabled = false);
  }
}

function handleAccountsChanged(accounts) {
  walletState.address = accounts?.[0] || null;
  if (!walletState.address) {
    walletState.chainId = null;
    walletState.provider = null;
  }
  updateWalletUi();
}

async function handleChainChanged(chainId) {
  walletState.chainId = chainId || null;
  updateWalletUi();
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
@media(max-width:800px){.aura-wallet-card{align-items:flex-start;flex-direction:column}.aura-wallet-card .btn{width:100%}}
`;
document.head.appendChild(walletStyle);
