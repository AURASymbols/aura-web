(()=>{"use strict";
const main=document.querySelector("#main-content");
function initShell(){
 const nav=document.querySelector("#nav");
 const links=[["HOME","/#home"],["NFT","/nft.html"],["PROJECT","/#ecosystem"],["PRODUCT","/product.html"],["STATUS","/status.html"],["DEVELOPERS","/developer-guide.html"],["FAQ","/faq.html"]];
 if(nav)nav.innerHTML=links.map(([n,u])=>'<a href="'+u+'">'+n+'</a>').join("");
 const menu=document.querySelector("#menu");
 if(menu&&nav){const clean=menu.cloneNode(true);menu.replaceWith(clean);clean.addEventListener("click",()=>{const open=nav.classList.toggle("open");clean.setAttribute("aria-expanded",String(open))});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");clean.setAttribute("aria-expanded","false")}))}
}
function initFilters(){
 const buttons=[...document.querySelectorAll(".a5-filters button")];
 const rows=[...document.querySelectorAll(".a5-feed article")];
 buttons.forEach(button=>button.addEventListener("click",()=>{
  buttons.forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active))});
  rows.forEach(row=>{row.hidden=button.dataset.filter!=="all"&&row.dataset.category!==button.dataset.filter});
 }));
}
function initReveal(){
 const sections=document.querySelectorAll(".a5-events,.a5-stats,.a5-terminal,.a5-institutions,.a5-stories,.a5-community,.a5-roadmap,.a5-final");
 if(!("IntersectionObserver"in window)){sections.forEach(section=>section.classList.add("a5-in"));return}
 const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("a5-in");io.unobserve(entry.target)}}),{threshold:.12});
 sections.forEach(section=>io.observe(section));
}
if(main&&!main.classList.contains("v34-page")&&!main.classList.contains("a5-document")){
 document.querySelector("body>footer")?.remove();document.querySelector("#modal")?.remove();
 fetch("/aura-v5.html").then(response=>{if(!response.ok)throw Error("AURA homepage failed to load");return response.text()}).then(markup=>{
  main.innerHTML=markup;document.documentElement.dataset.auraV5="ready";initShell();initFilters();initReveal();
 }).catch(error=>{console.error(error);main.setAttribute("data-load-error","true")});
}else initShell();
})();