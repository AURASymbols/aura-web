(()=>{"use strict";
const main=document.querySelector("#main-content");
function initShell(){
 const nav=document.querySelector("#nav");
 const links=[["HOME","/#home"],["NFT","/nft.html"],["PROJECT","/#ecosystem"],["PRODUCT","/product.html"],["STATUS","/status.html"],["DEVELOPERS","/developer-guide.html"],["FAQ","/faq.html"]];
 const path=location.pathname.length>1&&location.pathname.endsWith("/")?location.pathname.slice(0,-1):location.pathname;
 const hash=location.hash;
 const active=path==="/nft.html"?"NFT":path==="/product.html"?"PRODUCT":path==="/status.html"?"STATUS":path==="/developer-guide.html"?"DEVELOPERS":path==="/faq.html"?"FAQ":(hash==="#ecosystem"||hash==="#roadmap"||hash==="#token"||hash==="#updates")?"PROJECT":hash==="#works"||hash==="#assets"?"NFT":"HOME";
 if(nav)nav.innerHTML=links.map(([n,u])=>'<a href="'+u+'"'+(n===active?' aria-current="page"':'')+'>'+n+'</a>').join("");
 const topbtn=document.querySelector("header .topbtn");
 if(topbtn){topbtn.setAttribute("href","#community");topbtn.textContent="BUILD WITH US"}
 const menu=document.querySelector("#menu");
 if(menu&&nav){
  const clean=menu.cloneNode(true);menu.replaceWith(clean);
  clean.addEventListener("click",()=>{const open=nav.classList.toggle("open");clean.setAttribute("aria-expanded",String(open))});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");clean.setAttribute("aria-expanded","false")}));
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&nav.classList.contains("open")){nav.classList.remove("open");clean.setAttribute("aria-expanded","false");clean.focus()}});
 }
}
function initReveal(){
 const sections=document.querySelectorAll(".ag-reveal");
 if(!("IntersectionObserver"in window)){sections.forEach(section=>section.classList.add("ag-in"));return}
 const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("ag-in");io.unobserve(entry.target)}}),{threshold:.14});
 sections.forEach(section=>io.observe(section));
}
if(main&&!main.classList.contains("v34-page")&&!main.classList.contains("a5-document")){
 document.querySelector("body>footer")?.remove();document.querySelector("#modal")?.remove();
 document.getElementById("aura-premium-theme")?.remove();
 fetch("/aura-v5.html").then(response=>{if(!response.ok)throw Error("AURA homepage failed to load");return response.text()}).then(markup=>{
  main.innerHTML=markup;
  document.documentElement.dataset.auraV5="ready";
  document.body.classList.add("ag-home");
  document.getElementById("aura-premium-theme")?.remove();
  initShell();initReveal();
 }).catch(error=>{console.error(error);main.setAttribute("data-load-error","true")});
}else initShell();
})();
