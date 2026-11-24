(() => {
  "use strict";
  const set = (id, value, detail) => {
    const state = document.getElementById("s-" + id);
    const description = document.getElementById("d-" + id);
    if (state) state.textContent = value;
    if (description) description.textContent = detail;
  };
  document.addEventListener("DOMContentLoaded", () => {
    set("website", "ONLINE", "The AURA static website is being served.");
    set("backend", "NOT INCLUDED", "The Express API is not part of this static deployment.");
    set("database", "NOT INCLUDED", "Database-backed features are not available in this deployment.");
    set("ethereum", "NOT INCLUDED", "Server-side Ethereum RPC reads are not available in this deployment.");
    const heading = document.getElementById("overall-status");
    if (heading) heading.textContent = "AURA static website is available";
    const checked = document.getElementById("last-checked");
    if (checked) checked.textContent = "Deployment mode: static website. Backend services are intentionally excluded.";
    const button = document.getElementById("refresh-status");
    if (button) button.remove();
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
