(() => {
"use strict";
const main=document.querySelector("#main-content");
if(!main||document.documentElement.dataset.auraV4==="ready")return;
document.documentElement.dataset.auraV4="ready";
fetch("/aura-v4.html").then(r=>{if(!r.ok)throw new Error("AURA layout unavailable");return r.text()}).then(markup=>{
main.innerHTML=markup;
document.querySelector("body>footer")?.remove();
document.querySelector("#modal")?.remove();
const nav=document.querySelector("#nav");
const items=[["HOME","home"],["NFT","nft"],["ECOSYSTEM","ecosystem"],["PROOF","proof"],["ROADMAP","roadmap"],["INVESTORS","investors"],["BUILDERS","developers"],["PROJECT","project"],["FAQ","faq"],["STATUS","status"]];
if(nav)nav.innerHTML=items.map(([name,id])=>'<a href="#'+id+'">'+name+'</a>').join("");
const menu=document.querySelector("#menu");
if(menu&&nav){nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}))}
if("IntersectionObserver"in window){const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("a4-visible");reveal.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll(".a4-section,.a4-layer,.a4-phase").forEach(el=>reveal.observe(el));
const active=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&nav)nav.querySelectorAll("a").forEach(a=>a.classList.toggle("active",a.hash==="#"+e.target.id))}),{rootMargin:"-35% 0px -55% 0px"});items.forEach(([,id])=>{const el=document.getElementById(id);if(el)active.observe(el)})}else document.querySelectorAll(".a4-section,.a4-layer,.a4-phase").forEach(el=>el.classList.add("a4-visible"));
}).catch(err=>console.error(err));
})();