(() => {
  "use strict";

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const type = String(data.get("type") || "").trim();
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const text = [
        "AURA inquiry",
        `Type: ${type}`,
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message
      ].join("\n");
      const note = form.querySelector("[data-form-note]");
      try {
        await navigator.clipboard.writeText(text);
        if (note) note.textContent = "Message copied. Open @AURASymbol on X and paste it as a DM.";
        window.open("https://x.com/AURASymbol", "_blank", "noopener");
      } catch {
        if (note) note.textContent = "Could not copy automatically. Please message @AURASymbol on X directly.";
      }
    });
  }

  const statusRoot = document.querySelector("[data-status-root]");
  if (statusRoot) {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        const set = (key, value) => {
          const el = statusRoot.querySelector(`[data-status="${key}"]`);
          if (el) el.textContent = value;
        };
        set("service", data.ok ? "Online" : "Degraded");
        set("uptime", typeof data.uptimeSeconds === "number" ? `${data.uptimeSeconds}s` : "—");
        set("database", data.database?.status || data.database?.state || "not configured");
        set("ethereum", data.ethereum?.status || data.ethereum?.state || "not configured");
        set("timestamp", data.timestamp || new Date().toISOString());
      })
      .catch(() => {
        const el = statusRoot.querySelector('[data-status="service"]');
        if (el) el.textContent = "Unavailable";
      });
  }
})();
