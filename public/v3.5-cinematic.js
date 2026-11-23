(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const homeMarkup = [
    '<div class="a35-shell">',
    '<section class="a35-hero" aria-labelledby="a35-main-title">',
      '<div class="a35-hero-copy">',
        '<div class="a35-overline">AURA / INDEPENDENT DIGITAL IDENTITY</div>',
        '<h1 class="a35-title" id="a35-main-title"><span>AU</span><span class="a35-title-second">RA.</span></h1>',
        '<p class="a35-subline">A new language for digital identity.<br>Built from symbols. Expanded through technology.</p>',
        '<div class="a35-hero-bottom"><a class="a35-link" href="#a35-works">DISCOVER THE FIRST WORKS</a><a class="a35-link blue" href="#proof">VERIFY THE FOUNDATION</a></div>',
      '</div>',
      '<div class="a35-hero-art"><img src="/assets/aura-001-origin.png" alt="AURA #001 ORIGIN digital artwork" fetchpriority="high"><span class="a35-art-tag">OBJECT 001 / ORIGIN</span></div>',
      '<span class="a35-vertical">ETHEREUM / ERC-1155 / EARLY STAGE</span><span class="a35-scrollcue">SCROLL TO ENTER</span>',
    '</section>',
    '<div class="a35-marquee" aria-label="AURA identity, assets, technology and culture"><div class="a35-marquee-track"><span>IDENTITY <b>✳</b> ASSETS <b>✳</b> TECHNOLOGY <b>✳</b> CULTURE <b>✳</b> POSSIBILITY <b>✳</b> </span><span aria-hidden="true">IDENTITY <b>✳</b> ASSETS <b>✳</b> TECHNOLOGY <b>✳</b> CULTURE <b>✳</b> POSSIBILITY <b>✳</b> </span></div></div>',
    '<section class="a35-intro a35-reveal"><div class="a35-intro-label"><strong>01 / THE PREMISE</strong><small>A PROJECT IN PROGRESS<br>BUILT IN PUBLIC</small></div><h2>Not another interface.<br><em>A different point of view.</em></h2></section>',
    '<section class="a35-gallery" id="a35-works"><div class="a35-section-head a35-reveal"><div><div class="a35-eyebrow">02 / THE FIRST EXPRESSIONS</div><h2>THE<br>ARTIFACTS.</h2></div><p>Two published works mark the beginning of AURA. Not a collection of templates—a visual language taking its first shape.</p></div>',
      '<div class="a35-works">',
        '<article class="a35-work a35-reveal"><span class="a35-work-number">001</span><div class="a35-work-visual"><img src="/assets/aura-001-origin.png" alt="AURA #001 — ORIGIN" loading="lazy"></div><div class="a35-work-caption"><strong>ORIGIN / THE BEGINNING</strong><span>ETHEREUM · ERC-1155</span></div></article>',
        '<article class="a35-work a35-reveal"><span class="a35-work-number">002</span><div class="a35-work-visual"><img src="/assets/aura-002-force.png" alt="AURA #002 — FORCE" loading="lazy"></div><div class="a35-work-caption"><strong>FORCE / THE MOMENTUM</strong><span>ETHEREUM · ERC-1155</span></div></article>',
      '</div></section>',
    '<section class="a35-vision"><div><div class="a35-eyebrow">03 / THE SYSTEM</div><h2>ONE MARK.<br>MORE WORLDS.</h2></div><div class="a35-vision-copy"><p>AURA is exploring an ecosystem where digital identity, assets, participation and people connect through one coherent experience.</p><div class="a35-layers">',
      '<div class="a35-layer"><small>01 / ESTABLISHED</small><h3>NFT</h3><p>The first published expression of the AURA identity.</p></div>',
      '<div class="a35-layer"><small>02 / IN DEVELOPMENT</small><h3>PLATFORM</h3><p>The product experience is still being shaped.</p></div>',
      '<div class="a35-layer"><small>03 / RESEARCH</small><h3>TOKEN</h3><p>Economic design only when real utility exists.</p></div>',
      '<div class="a35-layer"><small>04 / TO BE BUILT</small><h3>COMMUNITY</h3><p>People who will challenge and shape the project.</p></div>',
    '</div><div class="a35-footnote">AURA is an early-stage project. Only the initial NFT layer is published; the wider ecosystem remains in development, research or planning.</div></div></section>',
    '<section class="a35-proof"><div class="a35-proof-mark a35-reveal"><strong>◯</strong></div><div class="a35-proof-copy a35-reveal"><div class="a35-eyebrow">04 / OPEN BY DESIGN</div><h2>LOOK<br>CLOSER.</h2><p>We believe a project should be examined, not merely described. Explore the public code, inspect the on-chain foundation and see what is—and is not—built.</p><div class="a35-proof-facts"><div><strong>02</strong><span>PUBLISHED NFT WORKS</span></div><div><strong>01</strong><span>PUBLIC ETHEREUM CONTRACT</span></div></div><a class="a35-link blue" href="#proof">INSPECT THE EVIDENCE</a></div></section>',
    '<section class="a35-end"><div><div class="a35-eyebrow">05 / THE NEXT CHAPTER</div><h2>MAKE<br><em>WHAT\'S NEXT.</em></h2></div><a class="a35-link" href="#contact">BUILD WITH AURA</a></section>',
    '<div class="a35-footer-note"><span>AURA / SYMBOLS OF BEING</span><span>EARLY STAGE · ETHEREUM · BUILDING IN PUBLIC</span></div>',
    '</div>'
  ].join("");
  function replaceHome() {
    const home = document.getElementById("home");
    if (!home || home.dataset.auraV35 === "true") return false;
    home.dataset.auraV35 = "true";
    home.innerHTML = homeMarkup;
    return true;
  }
  function addProgress() {
    if (document.querySelector(".a35-progress")) return;
    const bar=document.createElement("div");bar.className="a35-progress";bar.setAttribute("aria-hidden","true");bar.innerHTML="<span></span>";document.body.append(bar);
    const fill=bar.firstElementChild;let ticking=false;
    const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;fill.style.width=(max>0?Math.min(100,window.scrollY/max*100):0)+"%";ticking=false};
    window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();
  }
  function reveal() {
    const nodes=document.querySelectorAll(".a35-reveal");
    if(reduceMotion||!("IntersectionObserver" in window)){nodes.forEach(n=>n.classList.add("a35-visible"));return}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("a35-visible");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
    nodes.forEach(n=>observer.observe(n));
  }
  function pointerDepth() {
    if(reduceMotion||!matchMedia("(pointer:fine)").matches)return;
    const art=document.querySelector(".a35-hero-art"),img=art&&art.querySelector("img");if(!art||!img)return;
    art.addEventListener("pointermove",e=>{const r=art.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;img.style.transform="rotateY("+(-x*9)+"deg) rotateX("+(y*7)+"deg) scale(1.025)"});
    art.addEventListener("pointerleave",()=>{img.style.transform=""});
  }
  function navigation() {
    const menu=document.getElementById("menu"),nav=document.getElementById("nav");if(!menu||!nav)return;
    menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}));
  }
  function init(){if(!replaceHome())return;document.body.classList.add("aura-v35-active");addProgress();reveal();pointerDepth();navigation();document.documentElement.dataset.auraVersion="3.5";}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();