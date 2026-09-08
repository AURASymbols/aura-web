(() => {
  const ROLE_KEY = "aura_contact_role";
  const ROLE_COPY = {
    Investor: {
      label: "INVESTOR",
      message: "I’m interested in AURA at the early stage and would like to discuss capital, strategic support, or introductions."
    },
    Developer: {
      label: "DEVELOPER",
      message: "I’m interested in helping build AURA and would like to discuss my technical or product contribution."
    },
    Partner: {
      label: "PARTNER",
      message: "I’m interested in exploring a partnership, introduction, or other strategic contribution to AURA."
    }
  };

  function rememberRole(role) {
    if (ROLE_COPY[role]) sessionStorage.setItem(ROLE_KEY, role);
  }

  function applyRole() {
    const role = sessionStorage.getItem(ROLE_KEY);
    const data = ROLE_COPY[role];
    const form = document.getElementById("contactForm");
    if (!form || !data) return;

    const type = form.querySelector('[name="type"]');
    const message = form.querySelector('[name="message"]');
    if (type) {
      if ([...type.options].some(option => option.value === role)) type.value = role;
      else if ([...type.options].some(option => option.textContent.trim().toLowerCase().includes(role.toLowerCase()))) {
        const option = [...type.options].find(option => option.textContent.trim().toLowerCase().includes(role.toLowerCase()));
        type.value = option.value;
      }
    }
    if (message && !message.value.trim()) message.value = data.message;

    const section = document.getElementById("contact");
    if (section && !section.querySelector(".aura-selected-role")) {
      const note = document.createElement("div");
      note.className = "wrap aura-selected-role";
      note.innerHTML = `<small>YOUR PATH</small><strong>${data.label}</strong><span>Tell AURA what you can bring. The current contact path opens X because direct email is not configured yet.</span>`;
      const contactCards = section.querySelector(".contact-cards");
      if (contactCards) contactCards.before(note);
    }
  }

  function bindRoleLinks() {
    document.querySelectorAll('a[href^="#contact?role="]').forEach(link => {
      if (link.dataset.auraRoleBound) return;
      link.dataset.auraRoleBound = "true";
      const match = link.getAttribute("href").match(/role=([^&]+)/);
      const role = match ? decodeURIComponent(match[1]) : "";
      link.addEventListener("click", () => rememberRole(role));
    });
  }

  function routeRoleHash() {
    if (!location.hash.startsWith("#contact?role=")) return;
    const role = decodeURIComponent(location.hash.split("role=")[1] || "");
    rememberRole(role);
    history.replaceState(null, "", "#contact");
    setTimeout(applyRole, 0);
  }

  function installStyle() {
    if (document.getElementById("aura-contact-flow-style")) return;
    const style = document.createElement("style");
    style.id = "aura-contact-flow-style";
    style.textContent = `
      .aura-selected-role{margin-top:24px!important;padding:16px 0!important;border-top:1px solid #292929!important;border-bottom:1px solid #292929!important;display:grid!important;grid-template-columns:auto auto 1fr!important;gap:12px 18px!important;align-items:baseline!important}
      .aura-selected-role small{color:#8f876f!important;letter-spacing:.18em!important}
      .aura-selected-role strong{font-size:11px!important;letter-spacing:.14em!important;color:#d5c79d!important}
      .aura-selected-role span{font-size:10px!important;line-height:1.6!important;color:#666!important}
      @media(max-width:800px){.aura-selected-role{grid-template-columns:1fr!important;gap:6px!important}}
    `;
    document.head.append(style);
  }

  function run() {
    installStyle();
    bindRoleLinks();
    routeRoleHash();
    if (location.hash === "#contact") setTimeout(applyRole, 0);
  }

  run();
  window.addEventListener("hashchange", run);
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
