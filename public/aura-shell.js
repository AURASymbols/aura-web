(() => {
"use strict";
const nav=document.querySelector("header nav#nav");
const items=[["HOME","/#home"],["NFT","/#nft"],["ECOSYSTEM","/#ecosystem"],["PROOF","/#proof"],["ROADMAP","/#roadmap"],["INVESTORS","/#investors"],["BUILDERS","/#developers"],["PROJECT","/brief.html"],["FAQ","/faq.html"],["STATUS","/status.html"]];
if(nav){nav.innerHTML=items.map(([label,url])=>'<a href="'+url+'">'+label+'</a>').join("");const menu=document.querySelector("#menu");if(menu){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}));}}
})();