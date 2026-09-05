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

function closeMenu() { nav.classList.remove("open"); }
function closeModal() { modal.classList.remove("open"); }

menu?.addEventListener("click", () => nav.classList.toggle("open"));
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
    modalTitle.textContent = title;
    modalText.textContent = "The OpenSea link is not configured for this item yet.";
    modal.classList.add("open");
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
