(() => {
  function applyPremiumTheme() {
    if (document.getElementById("aura-premium-theme")) return;
    const link = document.createElement("link");
    link.id = "aura-premium-theme";
    link.rel = "stylesheet";
    link.href = "/premium-v2.css?v=2";
    document.head.appendChild(link);
  }
  if (document.readyState === "complete") applyPremiumTheme();
  else window.addEventListener("load", applyPremiumTheme, { once: true });
})();