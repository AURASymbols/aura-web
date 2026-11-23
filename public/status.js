(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  const labels = {
    connected: "CONNECTED",
    "not configured": "NOT CONFIGURED",
    "not-configured": "NOT CONFIGURED",
    unavailable: "UNAVAILABLE",
    unknown: "UNKNOWN"
  };

  function paint(key, value, detail) {
    const state = byId("s-" + key);
    const description = byId("d-" + key);
    if (state) state.textContent = labels[String(value || "unknown").toLowerCase()] || String(value || "unknown").toUpperCase();
    if (description) description.textContent = detail || "";
  }

  async function refresh() {
    const button = byId("refresh-status");
    if (button) button.disabled = true;
    byId("overall-status").textContent = "Checking current status…";
    try {
      const response = await fetch("/api/health", { cache: "no-store", headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Health endpoint returned an error.");
      paint("website", "connected", "This page is being served.");
      paint("backend", "connected", "Health endpoint responded successfully.");
      paint("database", data.database?.status || (data.database?.configured ? "connected" : "not configured"), data.database?.configured ? "Database integration is configured." : "Database-backed identity is optional and is not configured here.");
      paint("ethereum", data.ethereum?.status || (data.ethereum?.configured ? "connected" : "not configured"), data.ethereum?.configured ? "Ethereum RPC integration is configured." : "Live Ethereum reads are optional and are not configured here.");
      const optionalDown = [data.database?.status, data.ethereum?.status].some(value => value === "unavailable");
      byId("overall-status").textContent = optionalDown ? "Core service responding · optional integration issue" : "AURA public service is responding";
      byId("last-checked").textContent = "Last checked: " + new Date(data.timestamp || Date.now()).toLocaleString() + " · Uptime: " + Number(data.uptimeSeconds || 0) + " seconds.";
    } catch (error) {
      paint("website", "connected", "This status page is available.");
      paint("backend", "unavailable", error.message);
      paint("database", "unknown", "Could not retrieve current backend status.");
      paint("ethereum", "unknown", "Could not retrieve current backend status.");
      byId("overall-status").textContent = "Live system status unavailable";
      byId("last-checked").textContent = "Check failed: " + error.message;
    } finally {
      if (button) button.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const button = byId("refresh-status");
    if (button) button.addEventListener("click", refresh);
    const year = byId("year");
    if (year) year.textContent = new Date().getFullYear();
    refresh();
    window.setInterval(refresh, 60000);
  });
})();
