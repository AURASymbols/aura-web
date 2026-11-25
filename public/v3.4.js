(() => {
  "use strict";

  const GITHUB = "https://github.com/AURASymbols/aura-web";
  const CONTRACT = "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593";

  function addSkipLink() {
    if (document.querySelector(".skip-link")) return;
    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = "#main-content";
    link.textContent = "Skip to main content";
    document.body.prepend(link);
    const main = document.querySelector("main");
    if (main) {
      main.id = "main-content";
      main.setAttribute("tabindex", "-1");
    }
  }

  function addHeroEvidence() {
    const hero = document.querySelector("#home .hero");
    if (!hero || hero.querySelector(".v34-proof-strip")) return;
    const strip = document.createElement("div");
    strip.className = "v34-proof-strip";
    strip.setAttribute("aria-label", "AURA current project status");
    strip.innerHTML = [
      '<div><span>FIRST NFT LAYER</span><strong><i class="v34-live-dot"></i>LIVE ON ETHEREUM</strong></div>',
      '<div><span>CORE PLATFORM</span><strong>IN DEVELOPMENT</strong></div>',
      '<div><span>ECONOMIC LAYER</span><strong>RESEARCH ONLY</strong></div>'
    ].join("");
    const roles = hero.querySelector(".hero-roles");
    if (roles) roles.insertAdjacentElement("afterend", strip);
    else hero.append(strip);
  }

  function repairNavigation() {
    const menu = document.getElementById("menu");
    const nav = document.getElementById("nav");
    if (!menu || !nav) return;
    menu.setAttribute("aria-controls", "nav");
    menu.setAttribute("aria-expanded", "false");
  }

  function addGlobalLinks() {
    document.querySelectorAll('a[href^="https://"]').forEach(link => {
      if (link.hostname !== location.hostname && !link.hasAttribute("rel")) {
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  function annotateCurrentState() {
    document.querySelectorAll("[data-aura-current-state]").forEach(node => {
      node.textContent = "Early stage · public build";
    });
  }

  function init() {
    addSkipLink();
    addHeroEvidence();
    repairNavigation();
    addGlobalLinks();
    annotateCurrentState();
    document.documentElement.dataset.auraVersion = "3.4";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
