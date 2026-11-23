(() => {
  const id = "aura-premium-theme";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = "/premium.css?v=1";
  document.head.appendChild(link);
})();