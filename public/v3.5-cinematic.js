(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function createHero() {
    const hero = document.querySelector("#home .hero");
    if (!hero || hero.dataset.auraV35 === "true") return;
    hero.dataset.auraV35 = "true";
    hero.className = "a35-hero";
    hero.innerHTML = [
      '<canvas class="a35-particles" aria-hidden="true"></canvas>',
      '<div class="a35-copy">',
      '<div class="a35-kicker">AURA / BUILDING IN PUBLIC</div>',
      '<h1 class="a35-title">Identity,<em>in a new dimension.</em></h1>',
      '<p class="a35-description">AURA is an early-stage Ethereum Web3 project exploring the connection between identity, digital assets and community. The first NFT layer is live. The next layers are being built in public.</p>',
      '<div class="a35-actions"><a class="primary" href="#aura-story">ENTER THE AURA EXPERIENCE&nbsp; ↘</a><a href="#proof">VERIFY THE LIVE FOUNDATION&nbsp; ↗</a></div>',
      '<div class="a35-meta"><span>ETHEREUM / ERC-1155</span><span>EARLY STAGE</span><span>OPEN DEVELOPMENT</span></div>',
      '</div>',
      '<div class="a35-visual" aria-label="AURA ORIGIN artwork presented in a luminous orbital frame">',
      '<div class="a35-orbit" aria-hidden="true"></div>',
      '<figure class="a35-art-frame"><img src="/assets/aura-001-origin.png" alt="AURA #001 — ORIGIN, the first published AURA NFT" fetchpriority="high"><figcaption class="a35-art-caption"><span>AURA / 001</span><span>ORIGIN</span></figcaption></figure>',
      '</div><div class="a35-scroll" aria-hidden="true">SCROLL TO EXPLORE</div>'
    ].join("");
  }
  function createStory() {
    const home = document.getElementById("home");
    const hero = home && home.querySelector(".a35-hero");
    if (!home || !hero || home.querySelector("#aura-story")) return;
    const story = document.createElement("section");
    story.id = "aura-story";
    story.className = "a35-story";
    story.setAttribute("aria-label", "The AURA story");
    story.innerHTML = [
      '<header class="a35-story-head a35-reveal"><div><small>THE FIRST EXPRESSIONS</small><h2>Two symbols.<br>One beginning.</h2></div><p>AURA begins with published digital works. Each piece expresses a different force within the identity we are building.</p></header>',
      '<article class="a35-chapter a35-reveal"><div class="a35-chapter-art"><img src="/assets/aura-001-origin.png" alt="AURA #001 ORIGIN artwork" loading="lazy"></div><div class="a35-chapter-copy"><span class="a35-chapter-index">CHAPTER 01 / THE BEGINNING</span><small>THE FIRST MARK</small><h3>ORIGIN<em>.</em></h3><p>The starting point of AURA. A first expression of identity, presence and possibility, published on Ethereum as ERC-1155.</p><a href="https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/1" target="_blank" rel="noopener noreferrer">EXPLORE AURA #001 ↗</a></div></article>',
      '<article class="a35-chapter a35-reveal"><div class="a35-chapter-art"><img src="/assets/aura-002-force.png" alt="AURA #002 FORCE artwork" loading="lazy"></div><div class="a35-chapter-copy"><span class="a35-chapter-index">CHAPTER 02 / THE ENERGY</span><small>THE SECOND EXPRESSION</small><h3>FORCE<em>.</em></h3><p>Energy, resistance and momentum. A distinct expression in the same collection, extending the visual language beyond its origin.</p><a href="https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/2" target="_blank" rel="noopener noreferrer">EXPLORE AURA #002 ↗</a></div></article>',
      '<div class="a35-reveal"><div class="a35-story-head"><div><small>THE WIDER VISION</small><h2>One identity.<br>Four connected layers.</h2></div><p>The ecosystem is a direction under development—not a claim that every layer is already live.</p></div>',
      '<div class="a35-layers"><div class="a35-layer"><span>01 / LIVE FOUNDATION</span><h4>NFT</h4><p>The first published expression of AURA identity.</p></div><div class="a35-layer"><span>02 / IN DEVELOPMENT</span><h4>PLATFORM</h4><p>The product experience connecting identity and participation.</p></div><div class="a35-layer"><span>03 / RESEARCH</span><h4>TOKEN</h4><p>An economic layer to be considered only with real utility.</p></div><div class="a35-layer"><span>04 / TO BE BUILT</span><h4>COMMUNITY</h4><p>The people who challenge, contribute and shape the project.</p></div></div>',
      '<p class="a35-story-foot">AURA is early-stage. The NFT layer is published; the wider platform, token and community systems remain in development, research or planning.</p></div>'
    ].join("");
    hero.insertAdjacentElement("afterend", story);
  }
  function addProgress() {
    if (document.querySelector(".a35-progress")) return;
    const bar = document.createElement("div");
    bar.className = "a35-progress";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = "<span></span>";
    document.body.append(bar);
    const fill = bar.firstElementChild;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + "%";
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }
  function addReveals() {
    const nodes = document.querySelectorAll(".a35-reveal, #home > .wrap, #home > .panel, #home > .call");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(node => node.classList.add("a35-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("a35-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    nodes.forEach(node => { if (!node.classList.contains("a35-reveal")) node.classList.add("a35-reveal"); observer.observe(node); });
  }
  function addParticles() {
    if (reduceMotion) return;
    const canvas = document.querySelector(".a35-particles");
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    let width = 0, height = 0, frame = 0, particles = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(54, Math.max(18, Math.round(width * height / 21000)));
      particles = Array.from({ length: count }, () => ({ x: Math.random()*width, y: Math.random()*height, r: Math.random()*1.25+.25, a: Math.random()*.42+.12, v: Math.random()*.16+.035, phase: Math.random()*Math.PI*2 }));
    };
    let animationFrame = 0;
    const draw = () => {
      animationFrame = 0;
      if (document.hidden) return;
      context.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.v;
        if (p.y < -3) { p.y = height + 3; p.x = Math.random() * width; }
        const alpha = p.a * (.65 + Math.sin(frame * .012 + p.phase) * .35);
        context.beginPath(); context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fillStyle = "rgba(220,205,165," + alpha + ")"; context.fill();
      });
      frame++;
      animationFrame = window.requestAnimationFrame(draw);
    };
    const start = () => {
      if (!document.hidden && !animationFrame) animationFrame = window.requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else start();
    });
    resize(); window.addEventListener("resize", resize, { passive: true }); start();
  }
  function addPointerDepth() {
    if (reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;
    const visual = document.querySelector(".a35-visual"), frame = document.querySelector(".a35-art-frame");
    if (!visual || !frame) return;
    visual.addEventListener("pointermove", event => {
      const rect = visual.getBoundingClientRect(), x = (event.clientX-rect.left)/rect.width-.5, y = (event.clientY-rect.top)/rect.height-.5;
      frame.style.transform = "rotateY(" + (-9+x*9) + "deg) rotateX(" + (4-y*8) + "deg) translateZ(10px)";
    });
    visual.addEventListener("pointerleave", () => { frame.style.transform = ""; });
  }
  function init() {
    if (!document.querySelector("#home .hero")) return;
    document.body.classList.add("aura-v35-active");
    createHero(); createStory(); addProgress(); addReveals(); addParticles(); addPointerDepth();
    document.documentElement.dataset.auraVersion = "3.5";
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();